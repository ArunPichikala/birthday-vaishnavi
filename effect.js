$('document').ready(function () {
	var popActive = false;
	var balloonsLeft = 0;

	function seedAtmosphere() {
		var sparkles = '';
		var petals = '';
		for (var i = 0; i < 28; i++) {
			sparkles += '<span class="sparkle" style="left:' + Math.random() * 100 + '%;top:' + Math.random() * 100 + '%;animation-delay:' + (Math.random() * 3) + 's"></span>';
		}
		for (var j = 0; j < 16; j++) {
			petals += '<span class="petal" style="left:' + Math.random() * 100 + '%;animation-delay:' + (Math.random() * 8) + 's;animation-duration:' + (7 + Math.random() * 5) + 's"></span>';
		}
		$('.sparkle-layer').html(sparkles);
		$('.petal-layer').html(petals);
	}

	$(window).load(function () {
		$('.loading').fadeOut('fast');
		$('.container').fadeIn('fast');
		seedAtmosphere();
	});

	function rand(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function startBalloonLoop(id) {
		function step() {
			if (popActive || !$('#' + id).length || $('#' + id).hasClass('popped')) {
				return;
			}
			var w = $(window).width();
			var h = $(window).height();
			$('#' + id).animate(
				{
					left: rand(10, Math.max(20, w - 120)),
					bottom: rand(40, Math.max(80, h - 220))
				},
				rand(7000, 12000),
				step
			);
		}
		step();
	}

	function burstBits(x, y) {
		var colors = ['#f0c36a', '#ff8fa8', '#fff4ec', '#c43b5c', '#ffd6a5'];
		for (var i = 0; i < 10; i++) {
			var dx = rand(-90, 90) + 'px';
			var dy = rand(-120, 40) + 'px';
			var bit = $('<span class="pop-burst-bits"></span>').css({
				left: x + 'px',
				top: y + 'px',
				background: colors[i % colors.length],
				'--dx': dx,
				'--dy': dy
			});
			$('body').append(bit);
			setTimeout(function (el) {
				return function () {
					el.remove();
				};
			}(bit), 750);
		}
	}

	function updateBalloonCount() {
		$('#balloon-left').text(balloonsLeft);
	}

	function spawnExtraBalloons(count) {
		var imgs = ['b1.png', 'b2.png', 'b3.png', 'b4.png', 'b5.png', 'b6.png', 'b7.png'];
		var labels = ['✦', '♡', '♪', '✿', '★', '☺', '✧', '❀'];
		for (var i = 0; i < count; i++) {
			var id = 'extra' + i;
			var el = $(
				'<div class="balloons text-center poppable extra-balloon" id="' +
					id +
					'"><h2>' +
					labels[i % labels.length] +
					'</h2></div>'
			);
			el.css({
				backgroundImage: "url('" + imgs[i % imgs.length] + "')",
				left: rand(5, Math.max(10, $(window).width() - 100)) + 'px',
				bottom: rand(20, 280) + 'px',
				opacity: 0.95
			});
			$('body').append(el);
			startBalloonLoop(id);
		}
	}

	function beginMessageReveal() {
		$('body').removeClass('pop-mode');
		$('.pop-hud').fadeOut('fast');
		$('.cake').fadeOut('fast');
		$('.bannar').fadeOut('fast');
		$('.hero-name').fadeOut('fast');

		var toast = $(
			'<div class="unlock-toast"><h3>You did it, Vaishu</h3><p>This is the surprise for you</p></div>'
		);
		$('body').append(toast);
		setTimeout(function () {
			toast.addClass('show');
		}, 30);

		setTimeout(function () {
			toast.remove();
			$('.message').fadeIn('slow');
			runMessageLoop();
		}, 2200);
	}

	function runMessageLoop() {
		var total = $('.message p').length;
		var photoCount = 14;
		var photoIndex = 1;

		function startPhotoSlideshow() {
			setInterval(function () {
				photoIndex = (photoIndex % photoCount) + 1;
				$('#memory-photo').fadeOut(400, function () {
					$(this)
						.attr('src', 'photos/photo' + photoIndex + '.jpg')
						.fadeIn(400);
				});
			}, 2500);
		}

		function msgLoop(i) {
			$('.message p:nth-child(' + i + ')')
				.fadeOut(250)
				.delay(250)
				.promise()
				.done(function () {
					i = i + 1;
					if (i > total) {
						$('.message')
							.fadeOut(400)
							.promise()
							.done(function () {
								$('.photo-memories').fadeIn('slow');
								startPhotoSlideshow();
							});
						return;
					}
					$('.message p:nth-child(' + i + ')')
						.fadeIn(300)
						.delay(900)
						.promise()
						.done(function () {
							msgLoop(i);
						});
				});
		}

		msgLoop(0);
	}

	function onBalloonPop(e) {
		if (!popActive) {
			return;
		}
		var $balloon = $(this);
		if ($balloon.hasClass('popped') || $balloon.hasClass('popping')) {
			return;
		}

		e.preventDefault();
		e.stopPropagation();

		$balloon.stop(true, false);
		$balloon.addClass('popping popped');

		var offset = $balloon.offset();
		burstBits(offset.left + 40, offset.top + 50);

		balloonsLeft = Math.max(0, balloonsLeft - 1);
		updateBalloonCount();

		setTimeout(function () {
			$balloon.remove();
			if (balloonsLeft <= 0) {
				popActive = false;
				beginMessageReveal();
			}
		}, 420);
	}

	$('#turn_on').click(function () {
		$('#bulb_yellow').addClass('bulb-glow-yellow');
		$('#bulb_red').addClass('bulb-glow-red');
		$('#bulb_blue').addClass('bulb-glow-blue');
		$('#bulb_green').addClass('bulb-glow-green');
		$('#bulb_pink').addClass('bulb-glow-pink');
		$('#bulb_orange').addClass('bulb-glow-orange');
		$('body').addClass('peach');
		$(this)
			.fadeOut('slow')
			.delay(4000)
			.promise()
			.done(function () {
				$('#play').fadeIn('slow');
			});
	});

	$('#play').click(function () {
		var audio = $('.song')[0];
		audio.play();
		$('#bulb_yellow').addClass('bulb-glow-yellow-after');
		$('#bulb_red').addClass('bulb-glow-red-after');
		$('#bulb_blue').addClass('bulb-glow-blue-after');
		$('#bulb_green').addClass('bulb-glow-green-after');
		$('#bulb_pink').addClass('bulb-glow-pink-after');
		$('#bulb_orange').addClass('bulb-glow-orange-after');
		$('body').addClass('peach-after');
		$(this)
			.fadeOut('slow')
			.delay(5000)
			.promise()
			.done(function () {
				$('#bannar_coming').fadeIn('slow');
			});
	});

	$('#bannar_coming').click(function () {
		$('.bannar').addClass('bannar-come');
		$(this)
			.fadeOut('slow')
			.delay(5000)
			.promise()
			.done(function () {
				$('#balloons_flying').fadeIn('slow');
			});
	});

	$('#balloons_flying').click(function () {
		$('.balloon-border').animate({ top: -500 }, 8000);
		$('#b1,#b4,#b5,#b7').addClass('balloons-rotate-behaviour-one');
		$('#b2,#b3,#b6').addClass('balloons-rotate-behaviour-two');
		['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7'].forEach(startBalloonLoop);

		$(this)
			.fadeOut('slow')
			.delay(4500)
			.promise()
			.done(function () {
				$('#cake_fadein').fadeIn('slow');
			});
	});

	$('#cake_fadein').click(function () {
		$('.cake').fadeIn('slow');
		$(this)
			.fadeOut('slow')
			.delay(2500)
			.promise()
			.done(function () {
				$('#light_candle').fadeIn('slow');
			});
	});

	$('#light_candle').click(function () {
		$('.fuego').fadeIn('slow');
		$(this)
			.fadeOut('slow')
			.delay(1200)
			.promise()
			.done(function () {
				$('#pop_balloons').fadeIn('slow');
			});
	});

	$('#pop_balloons').click(function () {
		$(this).fadeOut('fast');
		popActive = true;
		$('body').addClass('pop-mode');

		// Spawn more balloons so popping feels like a mini-game
		spawnExtraBalloons(9);

		balloonsLeft = $('.balloons.poppable').not('.popped').length;
		updateBalloonCount();
		$('.pop-hud').fadeIn('slow');

		$(document)
			.off('click.pop touchend.pop')
			.on('touchend.pop', '.balloons.poppable', function (e) {
				e.preventDefault();
				onBalloonPop.call(this, e);
			})
			.on('click.pop', '.balloons.poppable', onBalloonPop);
	});
});
