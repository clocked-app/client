#!/bin/bash

echo "Installing neovim dependecies (neovim, git, gcc)..."
apk add neovim git build-base

echo "Installing packer.vim..."
git clone --depth 1 https://github.com/wbthomason/packer.nvim ~/.local/share/nvim/site/pack/packer/start/packer.nvim || {
  echo "packer already installed"
}

echo "Applying neovim configs..."
neovim_config_path=~/.config/nvim
if [ -d $neovim_config_path ]; then
  rm -rf $neovim_config_path
fi
git clone --depth 1 https://github.com/vncsmyrnk/vim-config-java.git $neovim_config_path
source $neovim_config_path/*/**.lua

echo "neovim is installed and configured"

exit 0
