-   When all you handles need to get the same type of data.
    (You can still hack this using unions)
-   When your number of events is reasonably small.
-   When you know the number of events beforehand.
-   When you need to call a lot of events at the same time.
-   When you need the same handler for multiple events.

# When not to @reix/bits:

-   When you need more events then the maximum number of bits in a js number.
-   When your events recive different types of data.

[@reix/bits docs](bits.html)
