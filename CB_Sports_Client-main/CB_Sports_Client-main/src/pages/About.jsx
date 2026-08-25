import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen px-4 py-10 bg-gray-100 sm:px-6 lg:px-20">
      <div className="max-w-5xl p-8 mx-auto space-y-8 bg-white shadow-lg rounded-2xl">
        <h1 className="text-4xl font-bold text-center">Giới thiệu</h1>

        <p className="text-lg text-gray-700">
          Chào mừng bạn đến với <strong>HL_Sports</strong> – nơi cung cấp các
          sản phẩm thể thao chất lượng cao, giúp bạn nâng cao hiệu suất và trải
          nghiệm tốt nhất.
        </p>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold ">Sứ mệnh của chúng tôi</h2>
          <p className="text-lg text-gray-700">
            Mang đến cho khách hàng những sản phẩm thể thao tốt nhất với mức giá
            hợp lý, đồng thời xây dựng một cộng đồng yêu thể thao bền vững.
          </p>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Vì sao chọn HL_Sports?</h2>
          <ul className="pl-6 space-y-2 text-gray-700 list-disc">
            <li className="text-lg">Sản phẩm chất lượng cao, chính hãng</li>
            <li className="text-lg">Dịch vụ giao hàng nhanh chóng, tiện lợi</li>
            <li className="text-lg">Chính sách đổi trả minh bạch, dễ dàng</li>
            <li className="text-lg">Hỗ trợ khách hàng 24/7</li>
          </ul>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Tầm nhìn của chúng tôi</h2>
          <p className="text-lg text-gray-700">
            HL_Sports hướng đến trở thành thương hiệu thể thao hàng đầu Việt
            Nam, nơi khách hàng luôn tìm thấy niềm tin và sự đồng hành trên con
            đường chinh phục thể thao.
          </p>
        </div>

        <div className="mt-10 text-center">
          <h3 className="mb-2 text-xl font-semibold ">
            Tham gia cùng chúng tôi
          </h3>
          <p className="mb-4 text-gray-700">
            Hãy khám phá ngay bộ sưu tập sản phẩm thể thao và bắt đầu hành trình
            của bạn cùng HL_Sports.
          </p>
          <Link to={"/products"}>
            <button className="px-6 py-2 text-white transition duration-300 bg-slate-800 rounded-xl hover:bg-yellow-500">
              Mua sắm ngay
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
