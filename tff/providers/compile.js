class Compile {
  render() {
    return "<h1>Hello World</h1>";
  }
}

export default {
  hello: new Compile(),
  $get: function () {
    return this.hello;
  },
};
