frappe.pages["employee-location"].on_page_load = function (wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: "Location Of all employees",
		single_column: true,
	});

	page.set_title("Employee Location");
	page.set_indicator("Loading Data", "orange");
	page.set_primary_action("Refresh", () => window.location.reload());

	// This will add a div element with map id to the body of the page
	$('<div id="map" style="height: 700px;"></div>').appendTo(page.body);

	frappe.call({
		method: "aate.aate.page.employee_location.employee_location.emploc",
		callback: function (r) {
			if (r.message) {
				page.set_indicator("Ready", "blue");
				var data = r.message;

				// Create a Leaflet map
				var map = L.map("map").setView(["23.591455", "58.556559"], 10); // Set default center and zoom level

				L.tileLayer(
					"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?lang=en"
				).addTo(map);

				// Loop through the employee location data and create markers
				for (var i = 0; i < data.length; i++) {
					var employee = data[i].employee;
					var time = data[i].time;
					var employee_name = data[i].employee_name;
					var latitude = data[i].latitude;
					var longitude = data[i].longitude;

					var popupContent = `
    <strong>Time : ${time}</strong><br>
	<strong>ID : ${employee}</strong><br>
    Employee Name : ${employee_name}<br>
    Latitude : ${latitude}<br>
    Longitude : ${longitude}
`;
					// Display employee name when clicking the marker
					L.marker([latitude, longitude])
						.addTo(map)
						.bindPopup(popupContent)
						.openPopup();
				}
			}
		},
	});
};