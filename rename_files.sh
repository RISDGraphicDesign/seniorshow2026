#!/bin/bash
# Remove all # characters from filenames in the web/ folder
cd web || exit 1
for f in *\#*; do
  [ -e "$f" ] || continue
  mv "$f" "${f//#/}"
  echo "Renamed: $f → ${f//#/}"
done
echo "Done!"
