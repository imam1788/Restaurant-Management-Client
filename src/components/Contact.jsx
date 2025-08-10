import React, { useState } from "react";
import Swal from "sweetalert2";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    Swal.fire({
      title: "Message Sent!",
      icon: "success",
      html: `<pre style="text-align:left;">${JSON.stringify(formData, null, 2)}</pre>`,
      confirmButtonColor: "#fbbf24",
    });

    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-lg">
      <h1 className="text-3xl font-bold mb-8 text-green-700 text-center">Contact Us</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-green-50 p-8 rounded shadow">
        <div>
          <label htmlFor="name" className="block font-semibold mb-1">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="input input-bordered w-full focus:ring-yellow-400 focus:border-yellow-400"
          />
        </div>

        <div>
          <label htmlFor="email" className="block font-semibold mb-1">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="input input-bordered w-full focus:ring-yellow-400 focus:border-yellow-400"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block font-semibold mb-1">Phone</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 234 567 890"
            className="input input-bordered w-full focus:ring-yellow-400 focus:border-yellow-400"
          />
        </div>

        <div>
          <label htmlFor="message" className="block font-semibold mb-1">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows="5"
            className="textarea textarea-bordered w-full focus:ring-yellow-400 focus:border-yellow-400"
          ></textarea>
        </div>

        <button
          type="submit"
          className="btn bg-yellow-400 hover:bg-yellow-500 text-black w-full"
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default Contact;
