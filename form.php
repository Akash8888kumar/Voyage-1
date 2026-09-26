
<form
    action="send-mail.php"
    method="POST"
    id="uae-enquiry-form"
>

    <!-- Fixed Destination -->
    <input
        type="hidden"
        name="destinationCountry"
        value="Kazakhstan"
    >

    <!-- Fixed Email Subject -->
    <input
        type="hidden"
        name="emailSubject"
        value="Kazakhstan Journey Enquiry — Voyage 1"
    >

    <div class="form-field">
        <label for="uae-first-name">First Name</label>
        <input
            autocomplete="given-name"
            class="form-control"
            id="uae-first-name"
            name="firstName"
            placeholder="Enter first name"
            required
        >
    </div>

    <div class="form-field">
        <label for="uae-last-name">Last Name</label>
        <input
            autocomplete="family-name"
            class="form-control"
            id="uae-last-name"
            name="lastName"
            placeholder="Enter last name"
            required
        >
    </div>

    <div class="form-field">
        <label for="uae-company">Company</label>
        <input
            autocomplete="organization"
            class="form-control"
            id="uae-company"
            name="company"
            placeholder="Company name"
        >
    </div>

    <div class="form-field">
        <label for="uae-email">Email</label>
        <input
            autocomplete="email"
            class="form-control"
            id="uae-email"
            name="email"
            placeholder="you@company.com"
            type="email"
            required
        >
    </div>

    <div class="form-field">
        <label for="uae-phone">Phone / WhatsApp</label>
        <input
            autocomplete="tel"
            class="form-control"
            id="uae-phone"
            name="phone"
            placeholder="Your phone / WhatsApp number"
            type="tel"
        >
    </div>

    <!-- USER COUNTRY -->
    <div class="form-field">
        <label for="uae-country">Country</label>

        <input
            autocomplete="country-name"
            class="form-control"
            id="uae-country"
            name="country"
            placeholder="Country"
        >
    </div>

    <div class="form-field">
        <label for="uae-date">Travel Date</label>

        <input
            class="form-control"
            id="uae-date"
            name="travelDate"
            type="date"
        >
    </div>

    <div class="form-field">
        <label for="uae-travelers">
            Number of Travelers
        </label>

        <input
            class="form-control"
            id="uae-travelers"
            name="travelers"
            min="1"
            placeholder="e.g. 12"
            type="number"
        >
    </div>

    <div class="form-field">
        <label for="uae-travel-type">
            Travel Type
        </label>

        <select
            class="form-select"
            id="uae-travel-type"
            name="travelType"
        >
            <option value="">
                Select travel type
            </option>

            <option value="FIT">FIT</option>
            <option value="Group">Group</option>
            <option value="MICE">MICE</option>
            <option value="Corporate">Corporate</option>
            <option value="Luxury">Luxury</option>
            <option value="Family">Family</option>
            <option value="Honeymoon">Honeymoon</option>
        </select>
    </div>

    <div class="form-field">
        <label for="uae-destination">
            Preferred City / Region
        </label>

        <select
            class="form-select"
            id="uae-destination"
            name="destination"
        >
            <option value="">
                Select city / region
            </option>

            <option value="Almaty">Almaty</option>
            <option value="Astana">Astana</option>
            <option value="Shymkent">Shymkent</option>
            <option value="Turkistan">Turkistan</option>
            <option value="Charyn Canyon">
                Charyn Canyon
            </option>
            <option value="Kolsai Lakes">
                Kolsai Lakes
            </option>
            <option value="Mangystau">
                Mangystau
            </option>
            <option value="Multi-city Kazakhstan">
                Multi-city Kazakhstan
            </option>
        </select>
    </div>

    <div class="form-field full">

        <label for="uae-requirements">
            Your Requirements
        </label>

        <textarea
            class="form-control"
            id="uae-requirements"
            name="requirements"
            placeholder="Tell us about your clients, dates, interests and requirements..."
        ></textarea>

    </div>

    <div class="form-actions">

        <p class="form-note">
            We’ll use these details only to prepare your Kazakhstan proposal.
        </p>

        <button
            class="btn btn-dark d-inline-flex align-items-center justify-content-center"
            type="submit"
            id="submit-enquiry-btn"
        >
            Submit Enquiry
            <span aria-hidden="true">→</span>
        </button>

    </div>

    <!-- SUCCESS / ERROR MESSAGE -->
    <div
        id="form-message"
        style="
            display:none;
            margin-top:20px;
            padding:14px 10px;
            font-size:14px;
            border-radius:6px;
        "
    ></div>

</form>



<!-- <form
   action="send-mail.php" method="POST"
    id="uae-enquiry-form">

    <input type="hidden" name="destinationCountry" value="Kazakhstan">
    <input type="hidden" name="emailSubject" value="Kazakhstan Journey Enquiry — Voyage 1">

    <div class="form-field">
        <label for="uae-first-name">First Name</label>
        <input
            autocomplete="given-name"
            class="form-control"
            id="uae-first-name"
            name="firstName"
            placeholder="Enter first name"
            required
        />
    </div>

    <div class="form-field">
        <label for="uae-last-name">Last Name</label>
        <input
            autocomplete="family-name"
            class="form-control"
            id="uae-last-name"
            name="lastName"
            placeholder="Enter last name"
            required
        />
    </div>

    <div class="form-field">
        <label for="uae-company">Company</label>
        <input
            autocomplete="organization"
            class="form-control"
            id="uae-company"
            name="company"
            placeholder="Company name"
        />
    </div>

    <div class="form-field">
        <label for="uae-email">Email</label>
        <input
            autocomplete="email"
            class="form-control"
            id="uae-email"
            name="email"
            placeholder="you@company.com"
            required
            type="email"
        />
    </div>

    <div class="form-field">
        <label for="uae-phone">Phone / WhatsApp</label>
        <input
            autocomplete="tel"
            class="form-control"
            id="uae-phone"
            name="phone"
            placeholder="Your phone / WhatsApp number"
            type="tel"
        />
    </div>

    <div class="form-field">
        <label for="uae-country">Country</label>
        <input
            autocomplete="country-name"
            class="form-control"
            id="uae-country"
            name="country"
            placeholder="Country"
        />
    </div>

    <div class="form-field">
        <label for="uae-date">Travel Date</label>
        <input
            class="form-control"
            id="uae-date"
            name="travelDate"
            type="date"
        />
    </div>

    <div class="form-field">
        <label for="uae-travelers">Number of Travelers</label>
        <input
            class="form-control"
            id="uae-travelers"
            min="1"
            name="travelers"
            placeholder="e.g. 12"
            type="number"
        />
    </div>

    <div class="form-field">
        <label for="uae-travel-type">Travel Type</label>
        <select
            class="form-select"
            id="uae-travel-type"
            name="travelType"
        >
            <option value="">Select travel type</option>
            <option value="FIT">FIT</option>
            <option value="Group">Group</option>
            <option value="MICE">MICE</option>
            <option value="Corporate">Corporate</option>
            <option value="Luxury">Luxury</option>
            <option value="Family">Family</option>
            <option value="Honeymoon">Honeymoon</option>
        </select>
    </div>

    <div class="form-field">
        <label for="uae-destination">Preferred City / Region</label>
        <select
            class="form-select"
            id="uae-destination"
            name="destination"
        >
            <option value="">Select city / region</option>
            <option value="Almaty">Almaty</option>
            <option value="Astana">Astana</option>
            <option value="Shymkent">Shymkent</option>
            <option value="Turkistan">Turkistan</option>
            <option value="Charyn Canyon">Charyn Canyon</option>
            <option value="Kolsai Lakes">Kolsai Lakes</option>
            <option value="Mangystau">Mangystau</option>
            <option value="Multi-city Kazakhstan">Multi-city Kazakhstan</option>
        </select>
    </div>

    <div class="form-field full">
        <label for="uae-requirements">Your Requirements</label>
        <textarea
            class="form-control"
            id="uae-requirements"
            name="requirements"
            placeholder="Tell us about your clients, dates, interests and requirements..."
        ></textarea>
    </div>

    <diva class="form-actions">
        <p class="form-note">
            We’ll use these details only to prepare your Kazakhstan proposal.
        </p>

        <button
            class="btn btn-dark d-inline-flex align-items-center justify-content-center"
            type="submit">
            Submit Enquiry <span aria-hidden="true">→</span>
        </button>
    </diva>

</form> -->




<script>

document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("uae-enquiry-form");
    const message = document.getElementById("form-message");
    const button = document.getElementById("submit-enquiry-btn");

    if (!form) {
        return;
    }

    form.addEventListener("submit", function (e) {

        // Prevent send-mail.php page redirect
        e.preventDefault();

        const formData = new FormData(form);

        button.disabled = true;
        button.innerHTML = "Sending...";

        message.style.display = "none";

        fetch("send-mail.php", {
            method: "POST",
            body: formData
        })

        .then(function (response) {
            return response.text();
        })

        .then(function (result) {

            result = result.trim();

            console.log("PHP Response:", result);

            if (result === "success") {

                message.style.display = "block";

                message.style.background = "#d1e7dd";
                message.style.color = "#0f5132";
                message.style.border = "1px solid #badbcc";

                message.innerHTML =
                    "Thank you! Your enquiry was submitted successfully.";

                form.reset();

                button.disabled = false;

                button.innerHTML =
                    'Submit Enquiry <span aria-hidden="true">→</span>';

            } else {

                message.style.display = "block";

                message.style.background = "#f8d7da";
                message.style.color = "#842029";
                message.style.border = "1px solid #f5c2c7";

                message.innerHTML = result;

                button.disabled = false;

                button.innerHTML =
                    'Submit Enquiry <span aria-hidden="true">→</span>';
            }

        })

        .catch(function (error) {

            console.error(error);

            message.style.display = "block";

            message.style.background = "#f8d7da";
            message.style.color = "#842029";
            message.style.border = "1px solid #f5c2c7";

            message.innerHTML =
                "Something went wrong. Please try again later.";

            button.disabled = false;

            button.innerHTML =
                'Submit Enquiry <span aria-hidden="true">→</span>';
        });

    });

});

</script>





<!-- <form
    action="send-mail.php"
    method="POST"
    data-destination="Kazakhstan"
    data-subject="Kazakhstan Journey Enquiry — Voyage 1"
    id="uae-enquiry-form">
                <div class="form-field"><label for="uae-first-name">First Name</label><input autocomplete="given-name"
                        class="form-control" id="uae-first-name" name="firstName" placeholder="Enter first name"
                        required="" /></div>
                <div class="form-field"><label for="uae-last-name">Last Name</label><input autocomplete="family-name"
                        class="form-control" id="uae-last-name" name="lastName" placeholder="Enter last name"
                        required="" /></div>
                <div class="form-field"><label for="uae-company">Company</label><input autocomplete="organization"
                        class="form-control" id="uae-company" name="company" placeholder="Company name" /></div>
                <div class="form-field"><label for="uae-email">Email</label><input autocomplete="email"
                        class="form-control" id="uae-email" name="email" placeholder="you@company.com" required=""
                        type="email" /></div>
                <div class="form-field"><label for="uae-phone">Phone / WhatsApp</label><input autocomplete="tel"
                        class="form-control" id="uae-phone" name="phone" placeholder="Your phone / WhatsApp number"
                        type="tel" /></div>
                <div class="form-field"><label for="uae-country">Country</label><input autocomplete="country-name"
                        class="form-control" id="uae-country" name="country" placeholder="Country" /></div>
                <div class="form-field"><label for="uae-date">Travel Date</label><input class="form-control"
                        id="uae-date" name="travelDate" type="date" /></div>
                <div class="form-field"><label for="uae-travelers">Number of Travelers</label><input
                        class="form-control" id="uae-travelers" min="1" name="travelers" placeholder="e.g. 12"
                        type="number" /></div>
                <div class="form-field"><label for="uae-travel-type">Travel Type</label><select class="form-select"
                        id="uae-travel-type" name="travelType">
                        <option value="">Select travel type</option>
                        <option>FIT</option>
                        <option>Group</option>
                        <option>MICE</option>
                        <option>Corporate</option>
                        <option>Luxury</option>
                        <option>Family</option>
                        <option>Honeymoon</option>
                    </select></div>
                <div class="form-field"><label for="uae-destination">Preferred City / Region</label><select
                        class="form-select" id="uae-destination" name="destination">
                        <option value="">Select city / region</option>
                        <option>Almaty</option>
                        <option>Astana</option>
                        <option>Shymkent</option>
                        <option>Turkistan</option>
                        <option>Charyn Canyon</option>
                        <option>Kolsai Lakes</option>
                        <option>Mangystau</option>
                        <option>Multi-city Kazakhstan</option>
                    </select></div>
                <div class="form-field full"><label for="uae-requirements">Your Requirements</label><textarea
                        class="form-control" id="uae-requirements" name="requirements"
                        placeholder="Tell us about your clients, dates, interests and requirements..."></textarea></div>
                <div class="form-actions">
                    <p class="form-note">We’ll use these details only to prepare your Kazakhstan proposal.</p>
                    <button
                        class="btn btn-dark d-inline-flex align-items-center justify-content-center"
                        type="submit">Submit Enquiry <span aria-hidden="true">→</span></button>
                </div>
            </form> -->