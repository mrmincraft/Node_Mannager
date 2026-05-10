#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_mqtt::init())
        .plugin(tauri_plugin_tcp::init())
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            log_message,
            export_messages,
            clear_old_logs,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

use tauri::Manager;
use std::fs;
use chrono::Utc;
use std::fs::OpenOptions;
use std::io::Write;

#[tauri::command]
fn log_message(session_name: Option<String>, message: String, app_handle: tauri::AppHandle) -> Result<(), String> {
    let app_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to get app data dir: {}", e))?;
    
    let timestamp = Utc::now().format("%Y-%m-%d").to_string();
    
    let log_path = if let Some(session) = session_name {
        app_dir.join("logs").join(&session).join(format!("{}.log", timestamp))
    } else {
        app_dir.join("logs").join("default").join(format!("{}.log", timestamp))
    };

    // Ensure directory exists
    if let Some(parent) = log_path.parent() {
        fs::create_dir_all(parent)
            .map_err(|e| format!("Failed to create log directory: {}", e))?;
    }

    // Append message to log file
    let entry = format!("{}\n", message);
    
    let mut file = OpenOptions::new()
        .create(true)
        .append(true)
        .open(&log_path)
        .map_err(|e| format!("Failed to open log file: {}", e))?;
    
    file.write_all(entry.as_bytes())
        .map_err(|e| format!("Failed to write log message: {}", e))?;
    
    Ok(())
}

#[tauri::command]
fn export_messages(filename: String, format: String, content: String, app_handle: tauri::AppHandle) -> Result<String, String> {
    let app_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to get app data dir: {}", e))?;
    
    let extension = match format.as_str() {
        "json" => "json",
        "csv" => "csv",
        "txt" => "txt",
        _ => "txt"
    };
    
    let export_path = app_dir.join("logs").join("exports").join(format!("{}.{}", filename, extension));
    
    // Ensure export directory exists
    if let Some(parent) = export_path.parent() {
        fs::create_dir_all(parent)
            .map_err(|e| format!("Failed to create export directory: {}", e))?;
    }
    
    fs::write(&export_path, content)
        .map_err(|e| format!("Failed to write export file: {}", e))?;
    
    Ok(export_path.to_string_lossy().to_string())
}

#[tauri::command]
fn clear_old_logs(days_old: u64, app_handle: tauri::AppHandle) -> Result<(), String> {
    use std::time::SystemTime;
    
    let app_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to get app data dir: {}", e))?;
    
    let logs_dir = app_dir.join("logs");
    
    if !logs_dir.exists() {
        return Ok(());
    }
    
    let entries = fs::read_dir(&logs_dir)
        .map_err(|e| format!("Failed to read logs directory: {}", e))?;
    
    let now = SystemTime::now();
    let cutoff = std::time::Duration::from_secs(days_old * 86400);
    
    for entry in entries.flatten() {
        let path = entry.path();
        if let Ok(metadata) = fs::metadata(&path) {
            if let Ok(modified) = metadata.modified() {
                if let Ok(elapsed) = now.duration_since(modified) {
                    if elapsed > cutoff && metadata.is_file() {
                        let _ = fs::remove_file(&path);
                    }
                }
            }
        }
    }
    
    Ok(())
}

