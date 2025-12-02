# Theme color tokens

In atomic design terminoly, theme tokens are like atoms. They are the most basic particle that will be combined to create base components, a.k.a mecules.

In practice, there are two major systems to handle colors:

1. Numbered tokens -> e.g. [blue-50, blue-100, blue-200, ..., blue-900, blue-950] -> Flexible but still forces to use the predefined colors. Allows for expressiveness but can also lead to inconsistencies and ugly designs. ALso handling dark mode or other themes is a lot of work.
2. Purpose-based tokens -> e.g. [primary, primary-hover, primary-active, primary-foreground, ...]

More constrained, unless there are a lot of tokens. The challenge is to have enough tokens and define purposes that are clear and intuitive. Such a system can easily be too constrained and lead to over-used escape hatches that defeat the purpose, using opacity such as primary/90, primary/80 for example. Or it can easily be bloated
