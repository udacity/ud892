describe('window height', function() {
	it('returns window height', function() {
		function getWindowHeight() {
			return window.innerHeight;
		}

		getWindowHeight();

		expect(getWindowHeight()).toEqual(jasmine.any(Number));
	});
});

describe('document', function() {
	it('document is defined', function() {
		expect(document).toBeDefined();
	});
});
