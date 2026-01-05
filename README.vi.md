# Bản Đồ Bệnh Viện Nhật Bản 🗾🏥

Ứng dụng React.js sử dụng Leaflet để hiển thị bệnh viện, xe cứu thương và tuyến đường cấp cứu tại Nhật Bản.

## Tính năng ✨

- 🗺️ **Bản đồ tương tác** sử dụng Leaflet
- � **6 Style bản đồ** để lựa chọn:
  - 🗾 淡色地図 (GSI Light) - Bản đồ màu nhạt
  - 🗾 標準地図 (GSI Standard) - Bản đồ tiêu chuẩn
  - 🗾 色別標高図 (Relief Map) - Bản đồ độ cao
  - 📷 写真 (Satellite) - Ảnh vệ tinh
  - 🌍 OpenStreetMap - Bản đồ chuẩn
  - 🌙 Dark Mode - Chế độ tối
- �🏥 **8 Bệnh viện** ở khu vực Tokyo với icon tùy chỉnh
- 🚑 **4 Xe cấp cứu** theo dõi vị trí thời gian thực
- 📍 **Điểm phát hiện** - nơi xảy ra sự cố
- 🔗 **Đường polygon** kết nối: Điểm phát hiện → Xe cấp cứu → Bệnh viện
- 🔍 **Tìm kiếm** bệnh viện hoặc xe cấp cứu
- ✅ **Bộ lọc layer** để bật/tắt từng loại dữ liệu

## Cài đặt 📦

```bash
# Cài đặt dependencies
yarn install
# hoặc
npm install
```

## Chạy ứng dụng 🚀

```bash
# Khởi động server phát triển
yarn start
# hoặc
npm start
```

Ứng dụng sẽ mở tại [http://localhost:3000](http://localhost:3000)

## Cấu trúc dự án 📁

```
src/
├── App.js              # Component chính
├── App.css             # Styles của ứng dụng
├── index.js            # Entry point
├── index.css           # Global styles
└── data/
    └── mockData.js     # Dữ liệu mock cho bệnh viện, xe cứu thương và tuyến đường

public/
├── index.html          # HTML template
└── assets/
    └── ic-circle-hospital.svg  # Icon bệnh viện
```

## Dữ liệu Mock 📊

Ứng dụng bao gồm dữ liệu mock cho:
- **8 bệnh viện** ở khu vực Tokyo:
  - 東京大学医学部附属病院 (University of Tokyo Hospital)
  - 慶應義塾大学病院 (Keio University Hospital)
  - 聖路加国際病院 (St. Luke's International Hospital)
  - Và nhiều bệnh viện khác...
  Đổi Style Bản Đồ
Click vào icon **Layers** ở góc trên bên phải để chọn style bản đồ:
- **淡色地図 (GSI Light)**: Bản đồ màu nhạt của GSI Japan
- **標準地図 (GSI Standard)**: Bản đồ tiêu chuẩn Nhật Bản
- **色別標高図 (Relief Map)**: Bản đồ hiển thị độ cao theo màu sắc
- **写真 (Satellite)**: Ảnh vệ tinh (mặc định)
- **OpenStreetMap**: Bản đồ cộng đồng quốc tế
- **Dark Mode**: Chế độ tối cho ban đêm

### 2. Bộ lọc Layer
Sử dụng các checkbox ở thanh bên để bật/tắt hiển thị:
- ✅ Bệnh viện (Hospital)
- ✅ Xe cấp cứu (Ambulance)
- ✅ Điểm phát hiện (Discovery Point)
- ✅ Tuyến đường (Route)

### 3. Tìm kiếm
Nhập tên bệnh viện hoặc mã số xe cấp cứu vào ô tìm kiếm để lọc kết quả

### 4e cấp cứu (Ambulance)
- ✅ Điểm phát hiện (Discovery Point)
- ✅ Tuyến đường (Route)

### 2. Tìm kiếm
Nhập tên bệnh viện hoặc mã số xe cấp cứu vào ô tìm kiếm để lọc kết quả

### 3. Xem chi tiết
Click vào bất kỳ marker nào trên bản đồ để xem thông tin chi tiết trong popup

## Logic Đường Polygon 🛣️

- **Mỗi polygon** kết nối 3 điểm: Điểm phát hiện → Xe cấp cứu → Bệnh viện
- **Nhiều xe cấp cứu** có thể đến cùng 1 bệnh viện
- **Mỗi tuyến đường** chỉ có 1 điểm phát hiện và 1 xe cấp cứu
- Đường được vẽ bằng **Polyline** với màu sắc khác nhau cho mỗi tuyến

## Công nghệ sử dụng 🛠️

- React 18.3.0
- React Leaflet 4.2.1
- Leaflet 1.9.4
- React Scripts 5.0.1

## Tùy chỉnh 🎨

### Thay đổi vị trí trung tâm bản đồ
Trong [App.js](App.js), dòng:
```javascript
<MapContainer center={[35.6895, 139.6917]} zoom={12}>
```

### Thêm bệnh viện mới
Trong [src/data/mockData.js](src/data/mockData.js):
```javascript
export const hospitals = [
  {
    id: 'h9',
    name: 'Tên bệnh viện',
    name_en: 'Hospital Name',
    lat: 35.xxx,
    lng: 139.xxx,
    address: 'Địa chỉ'
  },
  // ...
];
```

### Thay đổi icon bệnh viện
Thay thế file [public/assets/ic-circle-hospital.svg](public/assets/ic-circle-hospital.svg)

## Màn hình responsive 📱

Ứng dụng tự động điều chỉnh giao diện cho:
- Desktop: Thanh bên + Bản đồ
- Mobile: Thanh bên gập lại, bản đồ toàn màn hình

## License

MIT

---

**Tác giả**: GitHub Copilot  
**Ngày tạo**: 05/01/2026
