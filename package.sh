#!/bin/bash

if [ -z "$1" ]
  then
    echo "Building binary with no plugin"
    # Build binary
    pyinstaller -y -F \
      --add-data "whos_on_my_network/static;whos_on_my_network/static/" \
      --distpath ./ \
      -n whos_on_my_network.exe \
      run.py
    
  else
    echo "Building binary with plugin: $1"
    # Check the plugin exists
    [ ! -f "whos_on_my_network/plugins/$1.py" ] && echo "The plugin $1 does not exist." && exit 1
    # Create .packagedplugin file
    printf "$1" > .packagedplugin
    # Build binary
    pyinstaller -y -F \
      --add-data "whos_on_my_network/static;whos_on_my_network/static/" \
      --hidden-import "whos_on_my_network.plugins.$1" \
      --add-data ".packagedplugin;whos_on_my_network/" \
      --distpath ./ \
      -n whos_on_my_network.exe \
      run.py
    # Clean up .packagedplugin
    rm .packagedplugin
fi

# Clear up build files
rm whos_on_my_network.exe.spec
rm -rf build
rm -rf __pycache__
