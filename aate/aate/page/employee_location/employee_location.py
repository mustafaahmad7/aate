import frappe


@frappe.whitelist()
def emploc():
    loc = frappe.db.sql(
        """SELECT employee, employee_name , device_id, time FROM `tabEmployee Checkin` WHERE log_type = 'IN';""", as_dict=True)

    for entry in loc:
        device_id = entry.get('device_id', '')
        if device_id:
            # Check if there is a space after the comma
            if ', ' in device_id:
                # Split the device_id by a comma and space
                latitude, longitude = device_id.split(', ')
            else:
                # Split the device_id by a comma (no space)
                latitude, longitude = device_id.split(',')

            entry['latitude'] = latitude
            entry['longitude'] = longitude
            del entry['device_id']

    return loc