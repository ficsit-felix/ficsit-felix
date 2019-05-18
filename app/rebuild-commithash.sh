#!/bin/bash
# Writes the current commit hash into src/js/commithash.ts during build
HASH="development build"
if [[ "$@" == "build" ]]; then
    HASH="$(git rev-parse HEAD)"
fi
echo "const commithash = \"$HASH\";
export { commithash };" > src/js/commithash.ts;
