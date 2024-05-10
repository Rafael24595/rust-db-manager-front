export interface ServerStatus {
    rustc_version: string
    cargo_version: string,
    core_name: string,
    core_version: string,
    web_name: string,
    web_version: string,
    session_id: string,
    timestamp: number,
    services: number
}