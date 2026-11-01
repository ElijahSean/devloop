# CONT: containers

- **CONT-1 Replace, never patch.** Treat containers as disposable and rebuild them to change them. (Docker 2)
- **CONT-2 Keep state outside.** Containers should be stateless, with data in a database, object store or managed volume. (Docker 2)
- **CONT-3 Supply config at runtime.** One image for every environment. Environment variables can be seen through inspection, so secrets need more care. (Docker 2, 13)
- **CONT-4 Keep images small and repeatable.** Use multistage builds and a `.dockerignore`. Layers only add, so deleting a file in a later layer does not shrink the image or remove a secret from it. (Docker 4)
- **CONT-5 Run as non-root and add only what is needed.** Containers share the host kernel and are not a security boundary like a VM. Avoid `--privileged`. (Docker 11)
- **CONT-6 Set resource limits.** Without them, one container can starve its neighbours. (Docker 5, 9)
- **CONT-7 Log to stdout and stderr.** The platform handles routing. Do not write logs to files in the container. (Docker 6, 13)
- **CONT-8 Start fast and stop cleanly.** Handle SIGTERM and finish or hand back in-flight work. Provide a health check that the platform can use. (Docker 6, 7, 13)
- **CONT-9 Keep dev and prod alike.** Each difference hides a class of failures until production. (Docker 13)
