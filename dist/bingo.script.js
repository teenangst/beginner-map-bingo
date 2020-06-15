function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } class Sparkle extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			React.createElement("img", { className: "sparkle", style: this.props.css, src: "https://assets.codepen.io/199011/sparkle.png" }));
	}
}

class Tile extends React.Component {
	constructor(props) {
		super(props); _defineProperty(this, "handleClick",

			() => {
				if (this.props.item.star) return;
				this.props.onClick(this.props.el);
			}); this.state = { sparkles: new Array(5).fill(0).map(_ => ({ "--x": Math.random() * 100 + "%", "--y": Math.random() * 100 + "%", "--scale": Math.random() * 0.75 + 0.25, "--duration": Math.random() * 2 + 4 + "s", "--delay": Math.random() * 2 + "s" })) };
	}
	render() {
		return (
			React.createElement("div", {
				className: classNames({ checked: this.props.item.checked, star: this.props.item.star, line: this.props.item.line }),
				onClick: this.handleClick
			},
				this.props.item.name,
				this.props.item.star && React.createElement("i", { className: "fas fa-star" }),
				this.props.item.line && this.state.sparkles.map(css => React.createElement(Sparkle, { css: css }))));

	}
}

class App extends React.Component {

	constructor(props) {
		super(props); _defineProperty(this, "decodeBoolArray", n => new Array(24).fill(0).map((_, i) => (n >> 23 - i & 1) == 1)); _defineProperty(this, "encodeBoolArray", arr => arr.reduce((a, b) => (a << 1) + b)); _defineProperty(this, "checkLines",


			(items, i) => {
				items = items.map(x => {
					x.line = false;
					return x;
				});
				this.mask.filter(x => i == undefined || x.indexOf(i) != -1).forEach(mask => {
					if (mask.every(i => items[i].checked)) {
						mask.forEach(i => {
							items[i].line = true;
						});
					}
				});
				return items;
			}); _defineProperty(this, "toggleitem",
				n => {
					let items = this.state.items.map((x, i) => {
						if (i == n) {
							let item = x;
							item.checked = !item.checked;
							return item;
						} else return x;
					});
					this.setState({ items: this.checkLines(items) });
				}); _defineProperty(this, "uncheckEverything",
					() => {
						let items = this.state.items.map(x => {
							if (!x.star) {
								x.checked = false;
							}
							x.line = false;
							return x;
						});
						this.setState({ items });
					}); _defineProperty(this, "goToThisBoard",
						() => {
							let items = this.state.items.map(x => x.checked);
							items.splice(12, 1);
							window.location.href = `${window.location.origin}${window.location.pathname}?seed=${this.state.seed}&checked=${this.encodeBoolArray(items)}`;
						}); let urlsp = new URLSearchParams( /*"?seed=1337&checked=818266"*/window.location.search); this.state = { items: [], seed: urlsp.has("seed") ? parseInt(urlsp.get("seed")) : -1, urlchecked: urlsp.has("checked") ? this.decodeBoolArray(parseInt(urlsp.get("checked"))) : null }; this.mask = [[0, 6, 12, 18, 24], [4, 8, 12, 16, 20]].concat([...new Array(5).keys()].map(x => [...new Array(5).keys()].map(y => x * 5 + y))).concat([...new Array(5).keys()].map(x => [...new Array(5).keys()].map(y => y * 5 + x)));
	}
	async componentDidMount() {
		let response = await fetch(`https://api.skylarkx.uk/beginnermapperbingo${this.state.seed == -1 ? "" : `?seed=${this.state.seed}`}`);
		if (response.ok) {
			let json = await response.json();
			json.items = json.items.map((x, i) => ({ name: x, checked: this.state.urlchecked ? this.state.urlchecked[i] : false, star: false, line: false }));
			json.items.splice(12, 0, { name: "", checked: true, star: true, line: false });
			this.setState({ seed: json.seed, items: this.checkLines(json.items), urlchecked: null });
		} else {
			console.error(`Error ${response.status}`);
		}
	}
	render() {
		return (
			React.createElement(React.Fragment, null,
				React.createElement("div", { id: "title" }, "Beginner Map Bingo"),
				React.createElement("div", { id: "container" },
					React.createElement("div", { id: "board" },
						this.state.items.map((x, i) =>
							React.createElement(Tile, { key: i, el: i, item: x, onClick: () => this.toggleitem(i) }))),

					React.createElement("div", { id: "buttons" },
						React.createElement("div", { id: "clear", title: "Clear checks", onClick: this.uncheckEverything },
							React.createElement("i", { className: "fas fa-eraser fa-fw" })),
						React.createElement("div", { id: "share", title: "Share link to this board", onClick: this.goToThisBoard },
							React.createElement("i", { className: "fas fa-share fa-fw" })))),

				React.createElement("a", { href: "https://github.com/teenangst/beginner-map-bingo", target: "_blank", id: "credit", title: "Made on 15th June 2020" }, "Made By Skylark \"Help! Raccoons took my penis!\" Murphy!")));

	}
}

ReactDOM.render(React.createElement(App, null), document.getElementById("app"));