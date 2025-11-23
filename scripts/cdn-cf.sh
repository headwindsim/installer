#!/bin/bash

CDN_URL="https://cdn.headwindsim.net"
CDN_DIR=${1:-"installer/test"}
LOCAL_DIR=${2:-"./dist"}

MAX_RETRY=5

upload () {
    DEST="$CDN_URL/$CDN_DIR/$(basename -- "$1")"
    echo "Syncing file: $1"
    echo "Destination: $DEST"

    # Try to upload the file up to MAX_RETRY times before failing
    counter=0
    until curl --fail -X PUT -H "X-HDW-Access-Key: $CLOUDFLARE_WORKER_PASSWORD" -T "$1" "$DEST"
    do
        sleep 1
        [[ counter -eq $MAX_RETRY ]] && echo "Failed to upload file '$1'" >&2 && exit 1
        echo "Trying again. Try #$counter"
        ((counter++))
    done
    echo ""; echo ""
}

# Upload all files
for FILE in "${LOCAL_DIR}"/*; do
    upload "$FILE"
done

# Purge after all uploads that the files are somewhat in sync
echo "Purging cache"

# Check if required environment variables are set
if [ -z "$CLOUDFLARE_CDN_ZONE_ID" ]; then
    echo "Error: CLOUDFLARE_CDN_ZONE_ID environment variable is not set"
    exit 1
fi

if [ -z "$CLOUDFLARE_PURGE_TOKEN" ]; then
    echo "Error: CLOUDFLARE_PURGE_TOKEN environment variable is not set"
    exit 1
fi

# Build array of URLs to purge
PURGE_URLS=()
for FILE in "${FILES}"/*; do
    FILE_URL="$CDN_URL/$CDN_DIR/$(basename -- "$FILE")"
    PURGE_URLS+=("$FILE_URL")
    echo "Will purge: $FILE_URL"
done

# Create JSON payload for Cloudflare API
PURGE_JSON=$(jq -n --argjson urls "$(printf '%s\n' "${PURGE_URLS[@]}" | jq -R . | jq -s .)" '{files: $urls}')

echo "Purging cache via Cloudflare API"
echo "JSON payload: $PURGE_JSON"

# Call Cloudflare API to purge cache
PURGE_RESPONSE=$(curl -s -X POST \
    -H "Authorization: Bearer $CLOUDFLARE_PURGE_TOKEN" \
    -H "Content-Type: application/json" \
    -d "$PURGE_JSON" \
    "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_CDN_ZONE_ID/purge_cache")

echo "Purge response: $PURGE_RESPONSE"

# Check if purge was successful
if echo "$PURGE_RESPONSE" | grep -q '"success":true'; then
    echo "Cache purge successful"
else
    echo "Cache purge failed"
    echo "Response: $PURGE_RESPONSE"
    exit 1
fi