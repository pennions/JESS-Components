# JESS Components

# JCode - Code examples made easier.

A simple element that lets you create code examples easily.
Requires prism.js and prism.css for best results.

For HTML this is very easy as you can just embed the entire html code and it will work out of the box:

```html
<j-code language="html">
    <div>
        <span>I am an example</span>
    </div>
</j-code>
```

For other things, like JavaScript you need to use the contents property:

```html
<j-code
    language="js"
    contents="function HelloWorld() {\n   sendMessage();\n};"
>
</j-code>
```


# Support us

> If you are using this for paid products and services please consider:
> - Becoming a supporter on [Patreon.com](https://patreon.com/pennions)
> - Doing a one time donation on [Ko-Fi](https://ko-fi.com/pennions). 
> - If you want to donate but are not able to do so on these platforms, please contact us at www.pennions.com so we can provide an iDeal link.