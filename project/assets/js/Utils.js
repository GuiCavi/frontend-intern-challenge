var Utils = (function() {

	var publicAPI;

	publicAPI = {
		totalClicks: totalClicks,
		setTop5List: setTop5List,
		formatValues: formatValues,
		getUrls: getUrls,
		showTooltip: showTooltip
	};

	return publicAPI;

	///////////////
	// Functions //
	///////////////

	function totalClicks(urls) {
		var total = 0;

		for (var i = 0; i < urls.length; i++) {
			total += urls[i].hits;
		}

		// return total;
		return formatValues(total);
	}

	function setTop5List(urls) {
		var ord = urls.slice(0),
				$topList = document.getElementById('topfive-list');

		ord.sort(function(a, b) {
			return a.hits < b.hits;
		});

		ord.splice(0, 5).map(function(el, index, array) {
			var $li = document.createElement('li'),
					$link = document.createElement('span'),
					$count = document.createElement('span');

			$link.classList.add('link');
			$count.classList.add('count');

			$link.textContent = el.shortUrl;
			$count.textContent = formatValues(el.hits);

			$li.appendChild($link);
			$li.appendChild($count);

			$topList.appendChild($li);
		});
	}

	function formatValues(value) {
		return (""+value).reverse().match(/\d{1,3}/g).join('.').reverse();
	}

	function getUrls() {
		
		return new Promise(function(resolve, reject) {
			var xhr = (XMLHttpRequest ? new XMLHttpRequest() :  new ActiveXObject("Microsoft.XMLHTTP"));

			xhr.open('GET', './assets/urls.json', true);
			xhr.onload = function() {

				if (xhr.status == 200) {
					resolve(xhr.responseText);
				}
				else {
					reject(Error('Ops, não pode ler o arquivo'));
				}
			};

			xhr.onerror = function() {
				reject(Error('Error de rede'));
			}

			xhr.send();
		});
	};

	function showTooltip(tooltip) {
		var $tooltip = document.querySelector(tooltip);
					
		$tooltip.classList.add('show');
		setTimeout(function() {
			$tooltip.classList.remove('show');
		}, 2000);
	}

})();