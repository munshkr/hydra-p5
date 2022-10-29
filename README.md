# hydra-p5

A simpler P5 intergration for Hydra

## Usage

```javascript
await loadScript("https://unpkg.com/hydra-p5")

p5src(s0)
  .setup((p) => {
    // this runs only once, but re-executes
    // when evaluating the whole block...
  })
  .draw((p) => {
    // this runs on every frame
    p.clear()
    p.rect(p.mouseX, p.mouseY, 300, 300)
  })
  // now you can keep using hydra like a normal source...
  .modulate(noise())
  .out()
```

There is an experimental `drawP` and `setupP` that allows you to use P5 in
"global" mode inside their callback functions:

```javascript
p5src(s0)
  .drawP(_ => {
    clear()
    rect(mouseX, mouseY, 300, 300)
  })
  .out()
```
## Contributing

Bug reports and pull requests are welcome on GitHub at the [issues
page](https://github.com/munshkr/hydra-p5). This project is intended to be a safe,
welcoming space for collaboration, and contributors are expected to adhere to
the [Contributor Covenant](http://contributor-covenant.org) code of conduct.

## License

This project is licensed under GPL 3+. Refer to [LICENSE.txt](LICENSE.txt)
