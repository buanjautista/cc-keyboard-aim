// Input Definitions

sc.OPTIONS_DEFINITION['keys-aim'] = {
	type: "CONTROLS",
	init: {
		key1: ig.KEY.N,
		key2: undefined
	},
	cat: sc.OPTION_CATEGORY.CONTROLS,
	hasDivider: true,
	header: "cc-aim-master",
};

sc.OPTIONS_DEFINITION['keys-aim-up'] = {
	type: "CONTROLS",
	init: {
		key1: ig.KEY.NUMPAD_8,
		key2: undefined
	},
	cat: sc.OPTION_CATEGORY.CONTROLS,
	hasDivider: false,
	header: "cc-aim-master",
};

sc.OPTIONS_DEFINITION['keys-aim-down'] = {
	type: "CONTROLS",
	init: {
		key1: ig.KEY.NUMPAD_2,
		key2: undefined
	},
	cat: sc.OPTION_CATEGORY.CONTROLS,
	hasDivider: false,
	header: "cc-aim-master",
};

sc.OPTIONS_DEFINITION['keys-aim-left'] = {
	type: "CONTROLS",
	init: {
		key1: ig.KEY.NUMPAD_4,
		key2: undefined
	},
	cat: sc.OPTION_CATEGORY.CONTROLS,
	hasDivider: false,
	header: "cc-aim-master",
};

sc.OPTIONS_DEFINITION['keys-aim-right'] = {
	type: "CONTROLS",
	init: {
		key1: ig.KEY.NUMPAD_6,
		key2: undefined
	},
	cat: sc.OPTION_CATEGORY.CONTROLS,
	hasDivider: false,
	header: "cc-aim-master",
};

sc.OPTIONS_DEFINITION['keys-aim-up-left'] = {
	type: "CONTROLS",
	init: {
		key1: ig.KEY.NUMPAD_7,
		key2: undefined
	},
	cat: sc.OPTION_CATEGORY.CONTROLS,
	hasDivider: false,
	header: "cc-aim-master",
};

sc.OPTIONS_DEFINITION['keys-aim-up-right'] = {
	type: "CONTROLS",
	init: {
		key1: ig.KEY.NUMPAD_9,
		key2: undefined
	},
	cat: sc.OPTION_CATEGORY.CONTROLS,
	hasDivider: false,
	header: "cc-aim-master",
};

sc.OPTIONS_DEFINITION['keys-aim-down-left'] = {
	type: "CONTROLS",
	init: {
		key1: ig.KEY.NUMPAD_1,
		key2: undefined
	},
	cat: sc.OPTION_CATEGORY.CONTROLS,
	hasDivider: false,
	header: "cc-aim-master",
};

sc.OPTIONS_DEFINITION['keys-aim-down-right'] = {
	type: "CONTROLS",
	init: {
		key1: ig.KEY.NUMPAD_3,
		key2: undefined
	},
	cat: sc.OPTION_CATEGORY.CONTROLS,
	hasDivider: false,
	header: "cc-aim-master",
};

// Aim check replacements + KeyAim funcs

sc.Control.inject({
	aimStart: function () {
		return this.autoControl
			? this.autoControl.get("aimStart")
			: ig.input.pressed("aim") || ig.gamepad.isRightStickDown() || sc.control.checkKeyAim(); ;
	},
	aiming: function () {
		return this.autoControl
			? this.autoControl.get("aiming")
			: ig.input.state("aim") || ig.gamepad.isRightStickDown() || sc.control.checkKeyAim(); 
	},
	checkKeyAim: function () {
		return (
			ig.input.state('aim-up') || ig.input.state('aim-left') || ig.input.state('aim-right') || ig.input.state('aim-down') || 
			ig.input.state('aim-down-left') || ig.input.state('aim-down-right') || ig.input.state('aim-up-left') || ig.input.state('aim-up-right')) 
	},
	getKeyAim: function () {
		ig.input.state('aim-up') ? aimup = 1 : aimup = 0;
		ig.input.state('aim-up-right') ? aimupr = 1 : aimupr = 0;
		ig.input.state('aim-up-left') ? aimupl = 1 : aimupl = 0;
		ig.input.state('aim-down') ? aimdown = 1 : aimdown = 0;
		ig.input.state('aim-down-left') ? aimdownl = 1 : aimdownl = 0;
		ig.input.state('aim-down-right') ? aimdownr = 1 : aimdownr = 0;
		ig.input.state('aim-left') ? aimleft = 1 : aimleft = 0;
		ig.input.state('aim-right') ? aimright  = 1 : aimright  = 0;
		
		const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

		var y_axis = 0 + (
			clamp(((aimup + aimupr + aimupl)/3), -1, 1) 
		-
		clamp(((aimdown + aimdownl + aimdownr)/3), -1, 1));
			
		var x_axis = 0 + (
			clamp(((aimleft + aimupl + aimdownl)/3), -1, 1)
			-
			clamp(((aimright + aimdownr + aimupr)/3), -1, 1));

		var newAxis = {"x": x_axis, "y": y_axis, "z": 0}
		
		// console.log(x_axis, y_axis)
		return newAxis
	}
})

sc.PlayerCrossHairController.inject({
	updatePos: function (a) {
		if (this.gamepadMode) {
			if (sc.control.isRightStickDown()) {
				var c = Vec2.flip(Vec2.sub(a._getThrowerPos(e), a.coll.pos)),
					d = Vec2.assignC(
						b,
						sc.control.getAxesValue(ig.AXES.RIGHT_STICK_X) *
							ig.system.height *
							0.6,
						sc.control.getAxesValue(ig.AXES.RIGHT_STICK_Y) *
							ig.system.height *
							0.6
					);
				Vec2.lerp(c, d, ig.system.actualTick * 18);
				a._getThrowerPos(a.coll.pos);
				a.coll.pos.x = a.coll.pos.x + c.x;
				a.coll.pos.y = a.coll.pos.y + c.y;
			}
		} 

		else if (sc.control.checkKeyAim()){ 
			// An attempt to grab the key axis and slap it on the controller method above
			var c = Vec2.flip(Vec2.sub(a._getThrowerPos(this), a.coll.pos)),
					d = Vec2.flip(sc.control.getKeyAim());
					Vec2.lerp(c, d, ig.system.actualTick * 18);

			a._getThrowerPos(a.coll.pos);
			a.coll.pos.x = a.coll.pos.x + c.x;
			a.coll.pos.y = a.coll.pos.y + c.y;
		}

		else if (ig.input.state("aim"))
			ig.system.getMapFromScreenPos(	
				a.coll.pos,
				sc.control.getMouseX(),
				sc.control.getMouseY()
			);
	},
});