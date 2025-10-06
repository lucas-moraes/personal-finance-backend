# teste

```mermaid
flowchart LR;
    A(Routes) --> B(Controllers);
    B --> C(Use Cases);
    D(Adapters) --> B;
    C --> Domain
    E(Interface) --> C
```