## One court, several ways to occupy it

A futsal venue can receive an online reservation, a phone booking entered by its owner, and a competition fixture scheduled by an organizer. From the interface, those activities may look unrelated. From the court's perspective, they all compete for the same time.

A booking calendar that tracks each workflow in a separate list can accidentally advertise an occupied hour as available. This is not merely a visual bug. It is an integrity problem: two people may believe they have exclusive access to the same playing area.

Futsal is an example of the kind of product where this question matters. Its public repository describes online bookings, owner blocks, promotions, and competition fixtures sharing venue occupancy. This article discusses a general design approach; it is not a claim that every edge case has been validated in production.

## Model an occupied interval, not an empty box

The most useful abstraction is an occupancy record with a venue, court, start time, end time, reason, and lifecycle state. A reservation and a competition fixture differ in their metadata and permissions, but both reserve an interval on the same physical resource.

An illustrative type might look like this:

```ts
type Occupancy = {
  courtId: string;
  startsAt: string;
  endsAt: string;
  kind: 'online' | 'manual' | 'competition' | 'block';
  status: 'held' | 'confirmed' | 'cancelled';
};
```

A calendar cell is then a *view* of occupancy, not the authoritative store of it. Day, week, and month views are different ways to query the same records. This also keeps the backend independent from presentation choices such as the first day of the week or a particular visual grid.

## Define overlap once

For half-open intervals—where the start is included but the end is not—two bookings overlap when the first begins before the second ends and the second begins before the first ends.

```ts
const overlaps =
  existing.startsAt < requested.endsAt &&
  requested.startsAt < existing.endsAt;
```

The half-open convention matters. A match ending at 18:00 should not conflict with another booking beginning at 18:00, assuming turnover time is not separately required. If a venue needs cleaning or preparation intervals, those should be modeled as explicit buffers rather than hidden arithmetic in a screen component.

## The database must make the final decision

Imagine two phones reading the same open 19:00 slot. Both see it as free. Both tap Reserve. If validation happens only in the browser, each request may succeed locally before either receives the other's update.

The correct place to enforce non-overlap is inside an atomic server-side operation with a concurrency strategy. Depending on the database and booking model, options include row-level locking, exclusion constraints over time ranges, or a transaction that serializes access to the resource. The chosen guarantee must apply equally to online bookings, owner-entered reservations, and competition scheduling.

- Validate the court, operating hours, boundaries, and requested interval on the server.
- Check actual occupancy while holding the relevant transactional protection.
- Create the reservation and commit it as one coherent operation.
- Return a clear conflict response if another action took the slot first.

Retries also need attention. A mobile client may repeat a request after a timeout even when the first attempt succeeded. An idempotency key can help the backend recognize the same intent rather than booking twice.

## Design for a conflict, not just success

The interface should communicate uncertainty honestly. A visible empty slot means *last known availability*, not a promise that it will remain free while the user fills out a form. On submission, a conflict message can offer to refresh the timetable and choose another hour.

For venue owners, a manual reservation should use the same protections as an online request. Otherwise, the owner dashboard becomes a special path around the rules. Similarly, competition scheduling must not create fixtures on courts already occupied by regular reservations.

A good failure flow is concrete: keep the visitor's entered details when possible, explain which time is no longer available, and return them to a refreshed schedule. A generic “Something went wrong” message provides none of those clues.

## Local presentation still matters

In a multilingual scheduling product, time formatting and week starts are presentation concerns. Dari and Pashto layouts may need right-to-left navigation and different calendar conventions. Those preferences should not alter the canonical interval stored by the backend.

Dates should be interpreted in the venue's agreed timezone, and daylight-saving transitions must be addressed in regions that observe them. The UI can display friendly localized dates without mixing ambiguous local strings into database comparisons.

## The product lesson

The strongest booking experience begins with consistent rules, not a complicated calendar widget. Once every workflow consumes one availability model, the day/week/month layout becomes easier to trust. Clear conflict responses, sensible loading states, and realistic local-date formatting then turn that integrity into a usable interface.
