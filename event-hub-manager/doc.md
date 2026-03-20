# Azure Event Hub

## Key Services Characteristics

- Big data event streaming service
- Scalable up to terabytes of data and millions of events per second
- Reliable with zero data loss (agnostic to failures)
- Supports multiple protocols (AMQP, HTTPS, etc.) and SDKs

## Scenarios for Event Hubs
When to use Azure Event Hubs: Pretty much any scenario where you analyze a stream of data.

- Anomaly detection (fraud/outliers)
- Application logging
- Analytics pipelines, such as clickstream
- Live dashboard
- Archiving data
- Transaction processing
- User telemetry processing
- Device telemetry streaming

## The Basics

Key Concepts:

- Event producer: An application that sends events to Event Hubs via AMQP, HTTPS, or Kafka protocols.
- Partition: Each event hub is partitioned to allow for parallel processing of events. From 1 to 32 partitions can be created.
- Load balancing: Event Hubs automatically balances the load across partitions. Each partition can grow at a different rate.
  - Ordering is guaranteed within a partition, but not across partitions. 
  - Events are processed in the order they are received within a partition.
  - Partition key: A string that determines the partition an event is sent to. Events with the same partition key are sent to the same partition, ensuring order.
- Namespace: A logical container for multiple event hubs. It provides a scoping container for addressing Event Hubs. Shared properties include throughput, cost etc.



## Running the Emulator

```
docker compose -f <PathToDockerComposeFile> up -d
```

```
docker compose up -d
```

## Interact with the emulator

Connection string: 
```
"Endpoint=sb://localhost;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=SAS_KEY_VALUE;UseDevelopmentEmulator=true;"
```

