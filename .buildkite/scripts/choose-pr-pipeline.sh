#!/bin/bash

set -euo pipefail

ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )/../.." && pwd )"
cd "$ROOT"

: "${PR_WHITELIST:=}"
found=no
for whitelist_org in $PR_WHITELIST; do
  if [[ $BUILDKITE_PULL_REQUEST_REPO =~ $whitelist_org ]]; then
    echo "# friendly"
    cat .buildkite/pipeline.pr-friendly.yml
    found=yes
  fi
done

[[ "${found}" == "no" ]] && {
  echo "# guest"
  cat .buildkite/pipeline.pr-guest.yml
}
