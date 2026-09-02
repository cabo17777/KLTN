const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-[#0f0c29] via-[#302b63] to-[#24243e] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl p-10 border shadow-2xl backdrop-blur-md bg-white/10 border-white/20 rounded-2xl">
        <h2 className="mb-10 text-4xl font-bold text-center text-white">
          Liên hệ <span className="">CB_Sports</span>
        </h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Phần thông tin liên hệ */}
          <div className="flex flex-col items-center space-y-6 text-white">
            {/* Avatar to, nằm giữa */}

            <h3 className="text-2xl font-semibold">Thông tin liên hệ</h3>
            <p className="text-center text-gray-300">
              Nếu bạn có bất kỳ câu hỏi nào, hãy liên hệ với chúng tôi qua thông
              tin bên dưới.
            </p>
            <div className="space-y-2 text-center">
              <p>
                <strong>📍 Địa chỉ:</strong> 132A Sóng Hồng, Phường Phú Bài,
                Thành phố Huế
              </p>
              <p>
                <strong>📧 Email:</strong> support@cbsports.com
              </p>
              <p>
                <strong>📞 Điện thoại:</strong> 0123 456 789
              </p>
            </div>
            <img
              src="/3.jpg"
              alt="CB_Sports avatar"
              className="w-[260px] mb-6 border-4 rounded-full shadow-2xl h-[260px] border-white/40 object-cover object-top"
            />
          </div>

          {/* Phần biểu mẫu liên hệ */}
          <form className="space-y-6">
            <div>
              <label className="block mb-1 text-white">Họ và tên</label>
              <input
                type="text"
                placeholder="Nhập họ và tên"
                className="w-full px-4 py-2 text-white placeholder-gray-200 border bg-white/20 border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block mb-1 text-white">Email</label>
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="w-full px-4 py-2 text-white placeholder-gray-200 border bg-white/20 border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block mb-1 text-white">Nội dung</label>
              <textarea
                rows="4"
                placeholder="Nhập nội dung tin nhắn..."
                className="w-full px-4 py-2 text-white placeholder-gray-200 border bg-white/20 border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full py-2 font-semibold text-white transition-all duration-300 bg-gradient-to-r bg-slate-800 to-purple-500 rounded-xl hover:bg-yellow-500"
            >
              Gửi liên hệ
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
