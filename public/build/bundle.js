
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.25.1' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/Header.svelte generated by Svelte v3.25.1 */

    const file = "src/Header.svelte";

    function create_fragment(ctx) {
    	let header;
    	let nav;
    	let a0;
    	let t1;
    	let ul;
    	let li0;
    	let a1;
    	let img0;
    	let img0_src_value;
    	let t2;
    	let li1;
    	let a2;
    	let img1;
    	let img1_src_value;
    	let t3;
    	let li2;
    	let a3;
    	let img2;
    	let img2_src_value;

    	const block = {
    		c: function create() {
    			header = element("header");
    			nav = element("nav");
    			a0 = element("a");
    			a0.textContent = "JOSIAH YEOW";
    			t1 = space();
    			ul = element("ul");
    			li0 = element("li");
    			a1 = element("a");
    			img0 = element("img");
    			t2 = space();
    			li1 = element("li");
    			a2 = element("a");
    			img1 = element("img");
    			t3 = space();
    			li2 = element("li");
    			a3 = element("a");
    			img2 = element("img");
    			attr_dev(a0, "class", "logo svelte-1fqt3om");
    			add_location(a0, file, 35, 4, 512);
    			if (img0.src !== (img0_src_value = "/icons/linkedin.svg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "linkedin icon");
    			attr_dev(img0, "class", "svelte-1fqt3om");
    			add_location(img0, file, 39, 11, 634);
    			attr_dev(a1, "href", "https://www.linkedin.com/in/josiah-yeow/");
    			attr_dev(a1, "class", "svelte-1fqt3om");
    			add_location(a1, file, 38, 8, 572);
    			attr_dev(li0, "class", "svelte-1fqt3om");
    			add_location(li0, file, 37, 6, 559);
    			if (img1.src !== (img1_src_value = "/icons/github.svg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "github icon");
    			attr_dev(img1, "class", "svelte-1fqt3om");
    			add_location(img1, file, 44, 11, 782);
    			attr_dev(a2, "href", "https://github.com/josiahyeow");
    			attr_dev(a2, "class", "svelte-1fqt3om");
    			add_location(a2, file, 43, 8, 731);
    			attr_dev(li1, "class", "svelte-1fqt3om");
    			add_location(li1, file, 42, 6, 718);
    			if (img2.src !== (img2_src_value = "/icons/mail.svg")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "email icon");
    			attr_dev(img2, "class", "svelte-1fqt3om");
    			add_location(img2, file, 49, 11, 928);
    			attr_dev(a3, "href", "mailto:josiahyeow.dev@gmail.com");
    			attr_dev(a3, "class", "svelte-1fqt3om");
    			add_location(a3, file, 48, 8, 875);
    			attr_dev(li2, "class", "svelte-1fqt3om");
    			add_location(li2, file, 47, 6, 862);
    			attr_dev(ul, "class", "svelte-1fqt3om");
    			add_location(ul, file, 36, 4, 548);
    			attr_dev(nav, "class", "svelte-1fqt3om");
    			add_location(nav, file, 34, 2, 502);
    			attr_dev(header, "class", "svelte-1fqt3om");
    			add_location(header, file, 33, 0, 491);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, nav);
    			append_dev(nav, a0);
    			append_dev(nav, t1);
    			append_dev(nav, ul);
    			append_dev(ul, li0);
    			append_dev(li0, a1);
    			append_dev(a1, img0);
    			append_dev(ul, t2);
    			append_dev(ul, li1);
    			append_dev(li1, a2);
    			append_dev(a2, img1);
    			append_dev(ul, t3);
    			append_dev(ul, li2);
    			append_dev(li2, a3);
    			append_dev(a3, img2);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Header", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    /* src/Hero.svelte generated by Svelte v3.25.1 */

    const file$1 = "src/Hero.svelte";

    function create_fragment$1(ctx) {
    	let div2;
    	let div1;
    	let div0;
    	let t0;
    	let h1;
    	let t2;
    	let h2;
    	let t4;
    	let p;
    	let t5;
    	let i;
    	let t7;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			t0 = space();
    			h1 = element("h1");
    			h1.textContent = "Software Engineer";
    			t2 = space();
    			h2 = element("h2");
    			h2.textContent = "👋 Hi, I'm Josiah. I design and build web apps.";
    			t4 = space();
    			p = element("p");
    			t5 = text("What's a ");
    			i = element("i");
    			i.textContent = "web";
    			t7 = text(" app? - It's like the apps on your phone, just in your web browser.");
    			attr_dev(div0, "class", "square svelte-1glzuue");
    			add_location(div0, file$1, 29, 4, 530);
    			attr_dev(h1, "class", "svelte-1glzuue");
    			add_location(h1, file$1, 30, 4, 561);
    			attr_dev(h2, "class", "svelte-1glzuue");
    			add_location(h2, file$1, 31, 4, 592);
    			add_location(i, file$1, 34, 16, 677);
    			add_location(p, file$1, 34, 4, 665);
    			attr_dev(div1, "class", "hero-content svelte-1glzuue");
    			add_location(div1, file$1, 28, 2, 499);
    			attr_dev(div2, "class", "hero svelte-1glzuue");
    			add_location(div2, file$1, 27, 0, 478);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div1, t0);
    			append_dev(div1, h1);
    			append_dev(div1, t2);
    			append_dev(div1, h2);
    			append_dev(div1, t4);
    			append_dev(div1, p);
    			append_dev(p, t5);
    			append_dev(p, i);
    			append_dev(p, t7);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Hero", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Hero> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Hero extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Hero",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/Card.svelte generated by Svelte v3.25.1 */

    const file$2 = "src/Card.svelte";

    function create_fragment$2(ctx) {
    	let div1;
    	let a;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let h3;
    	let t1;
    	let t2;
    	let p;
    	let t3;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			a = element("a");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			h3 = element("h3");
    			t1 = text(/*title*/ ctx[1]);
    			t2 = space();
    			p = element("p");
    			t3 = text(/*description*/ ctx[2]);
    			attr_dev(img, "class", "app-image svelte-u6pkev");
    			if (img.src !== (img_src_value = /*icon*/ ctx[0])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			add_location(img, file$2, 45, 6, 833);
    			attr_dev(h3, "class", "svelte-u6pkev");
    			add_location(h3, file$2, 46, 6, 885);
    			attr_dev(div0, "class", "header svelte-u6pkev");
    			add_location(div0, file$2, 44, 4, 806);
    			add_location(p, file$2, 48, 4, 917);
    			attr_dev(a, "href", /*url*/ ctx[3]);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "class", "svelte-u6pkev");
    			add_location(a, file$2, 43, 2, 769);
    			attr_dev(div1, "class", "app-card shadow svelte-u6pkev");
    			add_location(div1, file$2, 42, 0, 737);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, a);
    			append_dev(a, div0);
    			append_dev(div0, img);
    			append_dev(div0, t0);
    			append_dev(div0, h3);
    			append_dev(h3, t1);
    			append_dev(a, t2);
    			append_dev(a, p);
    			append_dev(p, t3);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*icon*/ 1 && img.src !== (img_src_value = /*icon*/ ctx[0])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*title*/ 2) set_data_dev(t1, /*title*/ ctx[1]);
    			if (dirty & /*description*/ 4) set_data_dev(t3, /*description*/ ctx[2]);

    			if (dirty & /*url*/ 8) {
    				attr_dev(a, "href", /*url*/ ctx[3]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Card", slots, []);
    	let { icon } = $$props;
    	let { title } = $$props;
    	let { description } = $$props;
    	let { url } = $$props;
    	const writable_props = ["icon", "title", "description", "url"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Card> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("icon" in $$props) $$invalidate(0, icon = $$props.icon);
    		if ("title" in $$props) $$invalidate(1, title = $$props.title);
    		if ("description" in $$props) $$invalidate(2, description = $$props.description);
    		if ("url" in $$props) $$invalidate(3, url = $$props.url);
    	};

    	$$self.$capture_state = () => ({ icon, title, description, url });

    	$$self.$inject_state = $$props => {
    		if ("icon" in $$props) $$invalidate(0, icon = $$props.icon);
    		if ("title" in $$props) $$invalidate(1, title = $$props.title);
    		if ("description" in $$props) $$invalidate(2, description = $$props.description);
    		if ("url" in $$props) $$invalidate(3, url = $$props.url);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [icon, title, description, url];
    }

    class Card extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
    			icon: 0,
    			title: 1,
    			description: 2,
    			url: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Card",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*icon*/ ctx[0] === undefined && !("icon" in props)) {
    			console.warn("<Card> was created without expected prop 'icon'");
    		}

    		if (/*title*/ ctx[1] === undefined && !("title" in props)) {
    			console.warn("<Card> was created without expected prop 'title'");
    		}

    		if (/*description*/ ctx[2] === undefined && !("description" in props)) {
    			console.warn("<Card> was created without expected prop 'description'");
    		}

    		if (/*url*/ ctx[3] === undefined && !("url" in props)) {
    			console.warn("<Card> was created without expected prop 'url'");
    		}
    	}

    	get icon() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set icon(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get description() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set description(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get url() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Showcase.svelte generated by Svelte v3.25.1 */
    const file$3 = "src/Showcase.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (59:4) {#each apps as app}
    function create_each_block(ctx) {
    	let card;
    	let current;

    	card = new Card({
    			props: {
    				icon: /*app*/ ctx[1].icon,
    				title: /*app*/ ctx[1].title,
    				description: /*app*/ ctx[1].description,
    				url: /*app*/ ctx[1].url
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(card.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(card, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(card, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(59:4) {#each apps as app}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div1;
    	let h1;
    	let t1;
    	let div0;
    	let current;
    	let each_value = /*apps*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Some things I've created";
    			t1 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h1, "class", "svelte-hzglt5");
    			add_location(h1, file$3, 56, 2, 1569);
    			attr_dev(div0, "class", "apps svelte-hzglt5");
    			add_location(div0, file$3, 57, 2, 1605);
    			attr_dev(div1, "class", "showcase svelte-hzglt5");
    			add_location(div1, file$3, 55, 0, 1544);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h1);
    			append_dev(div1, t1);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*apps*/ 1) {
    				each_value = /*apps*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div0, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Showcase", slots, []);

    	let apps = [
    		{
    			icon: "/img/mojiparty.png",
    			title: "Mojiparty",
    			description: "An online multiplayer game where you compete against your friends to guess what emojis mean",
    			url: "https://www.mojiparty.io/"
    		},
    		{
    			icon: "/img/simple-chat-app.png",
    			title: "Simple Chat App",
    			description: "Native javascript chat room application using socket.io",
    			url: "https://simple-chat-app-000.herokuapp.com/"
    		},
    		{
    			icon: "/img/covid-19-dashboard.png",
    			title: "COVID-19 Dashboard",
    			description: "Dashboard which shows COVID-19 case data using React",
    			url: "https://josiahyeow.github.io/covid-19-dashboard/"
    		},
    		{
    			icon: "/img/pocketlint.png",
    			title: "PocketLint",
    			description: "iOS app for capturing quick photo notes with text recognition written in Swift",
    			url: "https://github.com/josiahyeow/PocketLint"
    		},
    		{
    			icon: "/img/flush.png",
    			title: "Flush",
    			description: "Gamified task tracking and scheduling app written in React Native",
    			url: "https://devpost.com/software/flush-d69mqj"
    		}
    	];

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Showcase> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Card, apps });

    	$$self.$inject_state = $$props => {
    		if ("apps" in $$props) $$invalidate(0, apps = $$props.apps);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [apps];
    }

    class Showcase extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Showcase",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/Tools.svelte generated by Svelte v3.25.1 */

    const file$4 = "src/Tools.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (61:6) {#each frontend as tool}
    function create_each_block_2(ctx) {
    	let li;
    	let div;
    	let t0;
    	let t1_value = /*tool*/ ctx[3].name + "";
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			li = element("li");
    			div = element("div");
    			t0 = space();
    			t1 = text(t1_value);
    			t2 = space();
    			attr_dev(div, "class", "color svelte-lk81wo");
    			set_style(div, "background-color", /*tool*/ ctx[3].color);
    			add_location(div, file$4, 62, 8, 1369);
    			attr_dev(li, "class", "svelte-lk81wo");
    			add_location(li, file$4, 61, 6, 1356);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, div);
    			append_dev(li, t0);
    			append_dev(li, t1);
    			append_dev(li, t2);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(61:6) {#each frontend as tool}",
    		ctx
    	});

    	return block;
    }

    // (72:6) {#each backend as tool}
    function create_each_block_1(ctx) {
    	let li;
    	let div;
    	let t0;
    	let t1_value = /*tool*/ ctx[3].name + "";
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			li = element("li");
    			div = element("div");
    			t0 = space();
    			t1 = text(t1_value);
    			t2 = space();
    			attr_dev(div, "class", "color svelte-lk81wo");
    			set_style(div, "background-color", /*tool*/ ctx[3].color);
    			add_location(div, file$4, 73, 8, 1592);
    			attr_dev(li, "class", "svelte-lk81wo");
    			add_location(li, file$4, 72, 6, 1579);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, div);
    			append_dev(li, t0);
    			append_dev(li, t1);
    			append_dev(li, t2);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(72:6) {#each backend as tool}",
    		ctx
    	});

    	return block;
    }

    // (83:6) {#each devops as tool}
    function create_each_block$1(ctx) {
    	let li;
    	let div;
    	let t0;
    	let t1_value = /*tool*/ ctx[3].name + "";
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			li = element("li");
    			div = element("div");
    			t0 = space();
    			t1 = text(t1_value);
    			t2 = space();
    			attr_dev(div, "class", "color svelte-lk81wo");
    			set_style(div, "background-color", /*tool*/ ctx[3].color);
    			add_location(div, file$4, 84, 8, 1813);
    			attr_dev(li, "class", "svelte-lk81wo");
    			add_location(li, file$4, 83, 6, 1800);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, div);
    			append_dev(li, t0);
    			append_dev(li, t1);
    			append_dev(li, t2);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(83:6) {#each devops as tool}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div;
    	let h1;
    	let t1;
    	let section0;
    	let h30;
    	let t3;
    	let ul0;
    	let t4;
    	let h31;
    	let t6;
    	let section1;
    	let ul1;
    	let t7;
    	let h32;
    	let t9;
    	let section2;
    	let ul2;
    	let each_value_2 = /*frontend*/ ctx[0];
    	validate_each_argument(each_value_2);
    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_2[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	let each_value_1 = /*backend*/ ctx[1];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let each_value = /*devops*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "Some things I've worked with";
    			t1 = space();
    			section0 = element("section");
    			h30 = element("h3");
    			h30.textContent = "Frontend";
    			t3 = space();
    			ul0 = element("ul");

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t4 = space();
    			h31 = element("h3");
    			h31.textContent = "Backend";
    			t6 = space();
    			section1 = element("section");
    			ul1 = element("ul");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t7 = space();
    			h32 = element("h3");
    			h32.textContent = "DevOps";
    			t9 = space();
    			section2 = element("section");
    			ul2 = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h1, "class", "svelte-lk81wo");
    			add_location(h1, file$4, 56, 2, 1238);
    			add_location(h30, file$4, 58, 4, 1292);
    			attr_dev(ul0, "class", "svelte-lk81wo");
    			add_location(ul0, file$4, 59, 4, 1314);
    			attr_dev(section0, "class", "svelte-lk81wo");
    			add_location(section0, file$4, 57, 2, 1278);
    			add_location(h31, file$4, 68, 2, 1505);
    			attr_dev(ul1, "class", "svelte-lk81wo");
    			add_location(ul1, file$4, 70, 4, 1538);
    			attr_dev(section1, "class", "svelte-lk81wo");
    			add_location(section1, file$4, 69, 2, 1524);
    			add_location(h32, file$4, 79, 2, 1728);
    			attr_dev(ul2, "class", "svelte-lk81wo");
    			add_location(ul2, file$4, 81, 4, 1760);
    			attr_dev(section2, "class", "svelte-lk81wo");
    			add_location(section2, file$4, 80, 2, 1746);
    			attr_dev(div, "class", "tools svelte-lk81wo");
    			add_location(div, file$4, 55, 0, 1216);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(div, t1);
    			append_dev(div, section0);
    			append_dev(section0, h30);
    			append_dev(section0, t3);
    			append_dev(section0, ul0);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].m(ul0, null);
    			}

    			append_dev(div, t4);
    			append_dev(div, h31);
    			append_dev(div, t6);
    			append_dev(div, section1);
    			append_dev(section1, ul1);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(ul1, null);
    			}

    			append_dev(div, t7);
    			append_dev(div, h32);
    			append_dev(div, t9);
    			append_dev(div, section2);
    			append_dev(section2, ul2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul2, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*frontend*/ 1) {
    				each_value_2 = /*frontend*/ ctx[0];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks_2[i]) {
    						each_blocks_2[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_2[i] = create_each_block_2(child_ctx);
    						each_blocks_2[i].c();
    						each_blocks_2[i].m(ul0, null);
    					}
    				}

    				for (; i < each_blocks_2.length; i += 1) {
    					each_blocks_2[i].d(1);
    				}

    				each_blocks_2.length = each_value_2.length;
    			}

    			if (dirty & /*backend*/ 2) {
    				each_value_1 = /*backend*/ ctx[1];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(ul1, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*devops*/ 4) {
    				each_value = /*devops*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul2, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks_2, detaching);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Tools", slots, []);

    	const frontend = [
    		{ name: "React", color: "#61dafb" },
    		{ name: "Svelte", color: "#ff3e00" },
    		{ name: "Angular", color: "#dd0031" },
    		{ name: "Swift", color: "#f53f25" },
    		{ name: "React Native", color: "#61dafb" }
    	];

    	const backend = [
    		{ name: "Node", color: "#026e00" },
    		{ name: "Express", color: "#259dff" },
    		{ name: "Socket.IO", color: "#010101" },
    		{ name: "Python", color: "#ffdc68" }
    	];

    	const devops = [
    		{ name: "Docker", color: "#0073ec" },
    		{ name: "Jenkins", color: "#d33833" },
    		{ name: "AWS", color: "#ec912d" },
    		{ name: "Firebase", color: "#ffcb2b" }
    	];

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Tools> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ frontend, backend, devops });
    	return [frontend, backend, devops];
    }

    class Tools extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tools",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/Footer.svelte generated by Svelte v3.25.1 */
    const file$5 = "src/Footer.svelte";

    function create_fragment$5(ctx) {
    	let footer;
    	let t0;
    	let strong;
    	let t2;

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			t0 = text("Created with 💻 in ");
    			strong = element("strong");
    			strong.textContent = "melbourne, au";
    			t2 = text(" using Svelte");
    			add_location(strong, file$5, 10, 27, 179);
    			attr_dev(footer, "class", "svelte-cssxoo");
    			add_location(footer, file$5, 10, 0, 152);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			append_dev(footer, t0);
    			append_dev(footer, strong);
    			append_dev(footer, t2);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Footer", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Card });
    	return [];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.25.1 */
    const file$6 = "src/App.svelte";

    function create_fragment$6(ctx) {
    	let main;
    	let header;
    	let t0;
    	let hero;
    	let t1;
    	let showcase;
    	let t2;
    	let tools;
    	let t3;
    	let footer;
    	let current;
    	header = new Header({ $$inline: true });
    	hero = new Hero({ $$inline: true });
    	showcase = new Showcase({ $$inline: true });
    	tools = new Tools({ $$inline: true });
    	footer = new Footer({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(header.$$.fragment);
    			t0 = space();
    			create_component(hero.$$.fragment);
    			t1 = space();
    			create_component(showcase.$$.fragment);
    			t2 = space();
    			create_component(tools.$$.fragment);
    			t3 = space();
    			create_component(footer.$$.fragment);
    			add_location(main, file$6, 8, 0, 208);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(header, main, null);
    			append_dev(main, t0);
    			mount_component(hero, main, null);
    			append_dev(main, t1);
    			mount_component(showcase, main, null);
    			append_dev(main, t2);
    			mount_component(tools, main, null);
    			append_dev(main, t3);
    			mount_component(footer, main, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(hero.$$.fragment, local);
    			transition_in(showcase.$$.fragment, local);
    			transition_in(tools.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(hero.$$.fragment, local);
    			transition_out(showcase.$$.fragment, local);
    			transition_out(tools.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(header);
    			destroy_component(hero);
    			destroy_component(showcase);
    			destroy_component(tools);
    			destroy_component(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Header, Hero, Showcase, Tools, Footer });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    const app = new App({
      target: document.body,
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
