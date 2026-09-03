#!/bin/bash
find frontend/src -type f -name '*.jsx' -o -name '*.js' | xargs sed -i 's|/settings/api/settingsService|/system/api/settingsService|g'
find frontend/src -type f -name '*.jsx' -o -name '*.js' | xargs sed -i 's|/settings/hooks/useSettings|/system/hooks/useSettings|g'
echo 'Done!'
