#!/usr/bin/env bash
if [ -e /amscores/backend ]; then
  cd /amscores/backend
  npm stop
fi
