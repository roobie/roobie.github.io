
set windows-shell := ["pwsh.exe", "-NoProfile", "-NoLogo", "-Command"]

default:
  just --list

format:
  mise run format

dev:
  just -f ./site/justfile dev
