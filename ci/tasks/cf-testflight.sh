#!/bin/bash

set -e
set -x
cf login -a https://api.run.pivotal.io -u ${cf_username} -p ${cf_password} -o ${cf_org} -s ${cf_space}
set +x

cd ghost-updated

app_name=${app_name:-ghost}
pg_name=${pg_name:-test-pg}
s3_name=${s3_name:-test-s3}

cf d ${app_name} -f || echo "skipping..."
cf ds ${pg_name} -f || echo "skipping..."
cf ds ${s3_name} -f || echo "skipping..."

cf cs ${cf_pg_service} ${cf_pg_service_plan} ${pg_name}
cf cs ${cf_s3_service} ${cf_s3_service_plan} ${s3_name}

# cf push ${app_name} --random-route --no-start
cf push ${app_name} --no-route --no-start -c "sleep 1d" --health-check-type none

cf bs ${app_name} ${pg_name}
cf bs ${app_name} ${s3_name}

cf restart ${app_name}
