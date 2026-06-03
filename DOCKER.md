# Docker Setup

This project runs as a single Node/Express web container.

## Start Docker Desktop

Open Docker Desktop and wait until it says the engine is running.

If it gets stuck on startup, restart Docker Desktop from the Windows tray icon or reboot Windows once after installation. Docker needs its WSL backend to finish starting before these commands will work.

## Build and Run

From this project folder:

```powershell
docker compose up --build
```

Then open:

```text
http://localhost:5000
```

## Stop

Press `Ctrl+C` in the terminal running Compose, then run:

```powershell
docker compose down
```

## Notes

- `database.json` is mounted into the container, so dashboard changes update the local file.
- `node_modules` and the local Windows Node download are ignored during Docker builds.
- The current Express server uses its built-in loan risk calculation. The Python `ml_api.py` service is present in the repo but is not currently wired into `server.js`.
