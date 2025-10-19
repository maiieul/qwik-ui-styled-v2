# Callout design decisions

## Name

The Callout is commonly named as "Alert", "Feedback", "Note", "Notice"...

It is most commonly referred to as Alert. But Alert is problematic because it implies the component should be used for Alerting the user that something requires their immediate attention. Some UI kits even wrongly attach a `role="alert"`, which will completely interrupt the experience of users of assistive technologies (https://developer.mozilla.org/fr/docs/Web/Accessibility/ARIA/Reference/Roles/alert_role).

Feedback sounds a bit like Callout, but it could be confused with a Toast.

Notes can come in very different forms, such as in the form of a tooltip, or a footnote.

Notice makes it sound like a user notice for a washing machine.

Callout implies that we want to get the user attention. It could be a callout to alert the user of something that requires their immediate attention, in which case attaching the `role="alert"` would be the correct accessibility behavior. But it could also be used to drag the user attention, as an info note, a success message, or a simple non-danger warning.

## Composition

As a base component, the Callout is composed of 3 parts: Root, Title, and Description.
