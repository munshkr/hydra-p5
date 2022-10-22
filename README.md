# hydra-p5

A simpler P5 intergration for Hydra

## Usage

```javascript
await loadScript("http://unpkg.com/hydra-p5@latest")

p5src(s0)
  .draw((p) => {
    p.clear()
    p.rect(p.mouseX, p.mouseY, 300, 300)
  })
  .modulate(noise())
  .out()
```

## Contributing

Bug reports and pull requests are welcome on GitHub at the [issues
page](https://github.com/munshkr/hydra-p5). This project is intended to be a safe,
welcoming space for collaboration, and contributors are expected to adhere to
the [Contributor Covenant](http://contributor-covenant.org) code of conduct.

## License

This project is licensed under GPL 3+. Refer to [LICENSE.txt](LICENSE.txt)
