# Convenience Makefile to help preview/build systems discover how to start the backend.
# Do NOT change this to any Python/uvicorn command.

.PHONY: start backend-start

start: backend-start

backend-start:
	@echo "Starting MoodLog backend via run.sh (Node.js + Express) ..."
	@bash ./run.sh
