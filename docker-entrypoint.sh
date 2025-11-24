#!/bin/sh
set -e

echo "Injecting runtime environment variables..."

# Replace placeholders with runtime env vars
envsubst < /usr/share/nginx/html/env.template.js > /usr/share/nginx/html/env-config.js

echo "Environment configuration created:"
cat /usr/share/nginx/html/env-config.js

# Execute the default Docker entrypoint and command
exec /docker-entrypoint.sh "$@"
