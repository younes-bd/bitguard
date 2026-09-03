#!/bin/bash
# Usage: ./scripts/strip-modules.sh --keep=crm,accounting,hr

# Parse arguments
for i in " $@;
#!/bin/bash
# Usage: ./scripts/strip-modules.sh --keep=crm,accounting,hr

# Parse arguments
for i in "$@"; do
  case $i in
    --keep=*)
      KEEP="${i#*=}"
      shift
      ;;
    *)
      ;;
  esac
done

if [ -z "$KEEP" ]; then
  echo "Error: --keep flag is required. Example: --keep=crm,accounting,hr"
  exit 1
fi

IFS=',' read -r -a keep_array <<< "$KEEP"

echo "Keeping modules: ${keep_array[@]}"
echo "Stripping all others..."

# Remove frontend modules
for module in frontend/src/apps/*; do
  mod_name=$(basename "$module")
  if [[ " ${keep_array[@]} " =~ " $mod_name " ]] || [ "$mod_name" == "settings" ] || [ "$mod_name" == "auth" ]; then
    continue
  fi
  echo "Removing frontend module: $mod_name"
  rm -rf "$module"
done

# Remove backend modules
for module in backend/apps/*; do
  mod_name=$(basename "$module")
  if [[ " ${keep_array[@]} " =~ " $mod_name " ]] || [ "$mod_name" == "core" ] || [ "$mod_name" == "users" ] || [ "$mod_name" == "system" ]; then
    continue
  fi
  echo "Removing backend module: $mod_name"
  rm -rf "$module"
done

echo "Modules stripped successfully. Core registry will automatically adapt on next boot."
