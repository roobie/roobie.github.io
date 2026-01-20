
set windows-shell := ["pwsh.exe", "-NoProfile", "-NoLogo", "-Command"]

default:
  just --list

dev:
  just -f ./site/justfile dev