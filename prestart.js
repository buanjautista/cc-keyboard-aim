// Input Definitions

sc.OPTIONS_DEFINITION['keys-aim'] = {
	type: "CONTROLS",
	init: {
		key1: ig.KEY.N,
		key2: undefined
	},
	cat: sc.OPTION_CATEGORY.CONTROLS,
	hasDivider: true,
	header: "cc-keyboard-aim",
};

sc.OPTIONS_DEFINITION['keys-aim-up'] = {
	type: "CONTROLS",
	init: {
		key1: ig.KEY.NUMPAD_8,
		key2: undefined
	},
	cat: sc.OPTION_CATEGORY.CONTROLS,
	hasDivider: false,
	header: "cc-keyboard-aim",
};

sc.OPTIONS_DEFINITION['keys-aim-down'] = {
	type: "CONTROLS",
	init: {
		key1: ig.KEY.NUMPAD_2,
		key2: undefined
	},
	cat: sc.OPTION_CATEGORY.CONTROLS,
	hasDivider: false,
	header: "cc-keyboard-aim",
};

sc.OPTIONS_DEFINITION['keys-aim-left'] = {
	type: "CONTROLS",
	init: {
		key1: ig.KEY.NUMPAD_4,
		key2: undefined
	},
	cat: sc.OPTION_CATEGORY.CONTROLS,
	hasDivider: false,
	header: "cc-keyboard-aim",
};

sc.OPTIONS_DEFINITION['keys-aim-right'] = {
	type: "CONTROLS",
	init: {
		key1: ig.KEY.NUMPAD_6,
		key2: undefined
	},
	cat: sc.OPTION_CATEGORY.CONTROLS,
	hasDivider: false,
	header: "cc-keyboard-aim",
};

sc.OPTIONS_DEFINITION['keys-aim-up-left'] = {
	type: "CONTROLS",
	init: {
		key1: ig.KEY.NUMPAD_7,
		key2: undefined
	},
	cat: sc.OPTION_CATEGORY.CONTROLS,
	hasDivider: false,
	header: "cc-keyboard-aim",
};

sc.OPTIONS_DEFINITION['keys-aim-up-right'] = {
	type: "CONTROLS",
	init: {
		key1: ig.KEY.NUMPAD_9,
		key2: undefined
	},
	cat: sc.OPTION_CATEGORY.CONTROLS,
	hasDivider: false,
	header: "cc-keyboard-aim",
};

sc.OPTIONS_DEFINITION['keys-aim-down-left'] = {
	type: "CONTROLS",
	init: {
		key1: ig.KEY.NUMPAD_1,
		key2: undefined
	},
	cat: sc.OPTION_CATEGORY.CONTROLS,
	hasDivider: false,
	header: "cc-keyboard-aim",
};

sc.OPTIONS_DEFINITION['keys-aim-down-right'] = {
	type: "CONTROLS",
	init: {
		key1: ig.KEY.NUMPAD_3,
		key2: undefined
	},
	cat: sc.OPTION_CATEGORY.CONTROLS,
	hasDivider: false,
	header: "cc-keyboard-aim",
};

// Aim check replacements + KeyAiming funcs

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
		aimup = ig.input.state('aim-up') || 0
		aimupr = ig.input.state('aim-up-right') || 0
		aimupl = ig.input.state('aim-up-left')  || 0

		aimdown = ig.input.state('aim-down') || 0
		aimdownl = ig.input.state('aim-down-left') || 0
		aimdownr = ig.input.state('aim-down-right') || 0

		aimleft = ig.input.state('aim-left') || 0
		aimright = ig.input.state('aim-right') || 0

		// Grabs each 'axis' and sum the adjacent sides to get the small diagonals
		up_sum = Number((aimup + aimupr + aimupl)/3)
		down_sum = Number((aimdown + aimdownl + aimdownr)/3)
		left_sum = Number((aimleft + aimdownl + aimupl)/3)
		right_sum = Number((aimright + aimdownr + aimupr)/3)

		// Gets the x-y axis from the input sum above
		var y_axis = 0 + ((up_sum - down_sum).limit(-1, 1));
		var x_axis = 0 + ((left_sum - right_sum).limit(-1, 1));

		var newAxis = {"x": x_axis, "y": y_axis, "z": 0}
		return newAxis
	}
})

sc.PlayerCrossHairController.inject({
	updatePos: function (a) {
		if (this.gamepadMode) {
      		this.parent(...args);
      		return;
    	}

		// An attempt to grab the key axis and slap it on the controller method above
		// i have no idea what this does

		else if (sc.control.checkKeyAim()){ 	
			// Grabs the keyboard aim vector and scales it with screen
			b = Vec2.create()
			Vec2.assignC(b, sc.control.getKeyAim().x * ig.system.height * 0.6, sc.control.getKeyAim().y * ig.system.height * 0.6)

			// Gets player position and compares with keyboard aim pos?
			var c = Vec2.flip(Vec2.sub(a._getThrowerPos(this), a.coll.pos)),

					d = Vec2.flip(b);
					
					Vec2.lerp(c, d, ig.system.actualTick * 18); 

			// Moves crosshair to new position
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