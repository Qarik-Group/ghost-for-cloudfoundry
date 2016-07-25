# CI pipeline

Install:

```
fly -t vsphere sp -p $(basename $(pwd)) -c ci/pipeline.yml -l ci/credentials.yml
```
