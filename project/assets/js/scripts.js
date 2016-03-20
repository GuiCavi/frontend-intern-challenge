document.addEventListener('DOMContentLoaded', function() {
	Utils.getUrls()
		.then(
			function(urls) {
				urls = JSON.parse(urls);

				return urls;
			},
			function(err) {
				console.log(err);
			}
		)
		.then(function(urls) {
			document.querySelector('#countlinks-section .counter').textContent = Utils.totalClicks(urls);

			return urls;
		})
		.then(function(urls) {
			Utils.setTop5List(urls);

			return urls;
		})
		.then(function(urls) {
			var $button = document.getElementById('short-link'),
					$input = document.getElementById('url'),
					$span = document.querySelector('span'),
					$clear = document.getElementById('clear-input');

			$button.addEventListener('click', function(e) {
				e.preventDefault();

				if ($input.value == '') {
					Utils.showTooltip($input.dataset.tooltip);

					$input.focus();
					return;
				}

				if ($input.classList.contains('shortened')) {
					if ($input.select) {
						$input.select();

						try {
							document.execCommand('copy');
							$input.blur();

							Utils.showTooltip($button.dataset.tooltip);
						} catch(err) {
							alert('Use conventional copy method');
						}
					}
				}
				else {
					var url = $input.value,
							shortUrl = "http://chr.dc/" + 
													Math.random()
															.toString(36)
															.replace(/[\d\.]/g, '')
															.reverse()
															.slice(0, 5)
															.split('')		
															.map(function(e, i, a) {
																return Math.random() < 0.13 ? e.toUpperCase() : e
															})
															.join('');

					for (var i = 0; i < urls.length; i++) {
						if (urls[i].url == url) {
							shortUrl = urls[i].shortUrl;
							break;
						}
					}

					$input.classList.add('shortened');
					$input.value = shortUrl;

					$span.fadeOut(300, function() {
						$span.textContent = 'Copiar';
						$span.fadeIn(300);
						$clear.fadeIn(300);
					});
				}
			});

			$input.addEventListener('keydown', function(e) {
				if (!e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
					this.classList.remove('shortened');

					if ($span.textContent === 'Encurtar') return;
					$span.fadeOut(300, function() {
						$span.textContent = 'Encurtar';
						$span.fadeIn(300);
					});

					$clear.fadeOut(300);
				}
			});

			$clear.addEventListener('click', function() {
				$input.value = '';
				$input.dispatchEvent(new Event('keydown'));
			});
		});

});

String.prototype.reverse = function() {
	return this.split('').reverse().join('');
}

Element.prototype.fadeOut = function(time, cb) {
	this.style.transition = time + 'ms ease-in-out opacity';
	this.style.opacity = '0';

	if (cb === undefined) return;
	setTimeout(cb, time);
};

Element.prototype.fadeIn = function(time, cb) {
	this.style.transition = time + 'ms ease-in-out opacity';
	this.style.opacity = '1';

	if (cb === undefined) return;
	setTimeout(cb, time);
};