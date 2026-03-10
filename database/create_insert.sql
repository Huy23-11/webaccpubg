create database web_game_acc
use web_game_acc;
CREATE TABLE ChuShop (
    ma_chu INT IDENTITY(1,1) PRIMARY KEY,
    tai_khoan NVARCHAR(50) NOT NULL UNIQUE,
    mat_khau NVARCHAR(255) NOT NULL
);
select * from AnhAcc where ma_acc=1;
select * from NguoiMua;
CREATE TABLE NguoiMua (
    ma_nguoi_mua INT IDENTITY(1,1) PRIMARY KEY,
    ten NVARCHAR(100) NOT NULL,
    email NVARCHAR(100) NOT NULL UNIQUE,
    tai_khoan NVARCHAR(50) NOT NULL UNIQUE,
    mat_khau NVARCHAR(255) NOT NULL,
    so_du DECIMAL(18,2) DEFAULT 0,
    qr_nap_tien NVARCHAR(255),
);

CREATE TABLE Acc (
    ma_acc INT IDENTITY(1,1) PRIMARY KEY,
    gia DECIMAL(18,2) NOT NULL,
    ngay_dang DATE NOT NULL,
    mo_ta NVARCHAR(500),
    so_luot_xem INT DEFAULT 0,

    gang_tay BIT DEFAULT 0,
    mu_dinh BIT DEFAULT 0,
    sieu_xe BIT DEFAULT 0,
    bape BIT DEFAULT 0,

    trang_thai NVARCHAR(20) NOT NULL,

    CONSTRAINT CK_Acc_TrangThai
        CHECK (trang_thai IN ('ACTIVE', 'SOLD', 'DELETED')),
);

CREATE TABLE DonMuaAcc (
    ma_acc INT NOT NULL primary key,
    ma_nguoi_mua INT NOT NULL,
    thoi_diem DATETIME NOT NULL DEFAULT GETDATE(),

    CONSTRAINT FK_DonMua_NguoiMua
        FOREIGN KEY (ma_nguoi_mua) REFERENCES NguoiMua(ma_nguoi_mua)
        ON DELETE CASCADE,

    CONSTRAINT FK_DonMua_Acc
        FOREIGN KEY (ma_acc) REFERENCES Acc(ma_acc)
        ON DELETE CASCADE
);
exec sp_help DonMuaAcc;
alter table DonMuaAcc
add CONSTRAINT FK_DonMua_NguoiMua
        FOREIGN KEY (ma_nguoi_mua) REFERENCES NguoiMua(ma_nguoi_mua)
        ON DELETE CASCADE;
CREATE TABLE DonNapTien (
    ma_don INT IDENTITY(1,1) PRIMARY KEY,
    ma_nguoi_mua INT NOT NULL,
    so_tien DECIMAL(18,2) NOT NULL,
    thoi_diem DATETIME NOT NULL DEFAULT GETDATE(),
    trang_thai NVARCHAR(20) NOT NULL,

    CONSTRAINT CK_DonNap_TrangThai
        CHECK (trang_thai IN ('PENDING', 'SUCCESS', 'FAILED')),

    CONSTRAINT FK_DonNap_NguoiMua
        FOREIGN KEY (ma_nguoi_mua) REFERENCES NguoiMua(ma_nguoi_mua)
);

CREATE TABLE AccTrongGio (
    ma_nguoi_mua INT NOT NULL,
    ma_acc INT NOT NULL,

    CONSTRAINT PK_AccTrongGio
        PRIMARY KEY (ma_nguoi_mua, ma_acc),

    CONSTRAINT FK_Gio_NguoiMua
        FOREIGN KEY (ma_nguoi_mua) REFERENCES NguoiMua(ma_nguoi_mua),

    CONSTRAINT FK_Gio_Acc
        FOREIGN KEY (ma_acc) REFERENCES Acc(ma_acc)
);

CREATE TABLE WebHook(
    ma INT NOT NULL,
    noi_dung_ck VARCHAR(20) NOT NULL,
    so_tien INT NOT NULL,
    ma_don INT
);

CREATE TABLE AnhAcc (
    ma_anh INT IDENTITY(1,1) PRIMARY KEY,
    ma_acc INT NOT NULL,
    duong_dan NVARCHAR(255) NOT NULL,
    thu_tu INT DEFAULT 1,

    CONSTRAINT FK_AnhAcc_Acc
        FOREIGN KEY (ma_acc) REFERENCES Acc(ma_acc)
        ON DELETE CASCADE
);
INSERT INTO Acc (gia, ngay_dang, mo_ta, so_luot_xem, gang_tay, mu_dinh, sieu_xe, bape, trang_thai)
    VALUES(1500000.00, '2026-03-03', N'Acc full đồ hiếm, có siêu xe và mũ đinh', 0, 1, 1, 1, 0, 'ACTIVE');
INSERT INTO Acc 
(gia, ngay_dang, mo_ta, so_luot_xem, gang_tay, mu_dinh, sieu_xe, bape, trang_thai)
VALUES
(1200000.00, '2026-03-03', N'Acc có găng tay hiếm, full skin cơ bản', 0, 1, 0, 0, 0, 'ACTIVE'),

(2000000.00, '2026-03-03', N'Acc full option: găng tay, mũ đinh, siêu xe, Bape', 0, 1, 1, 1, 1, 'ACTIVE'),

(950000.00, '2026-03-03', N'Acc giá rẻ, có mũ đinh và vài skin sự kiện', 0, 0, 1, 0, 0, 'ACTIVE'),

(1750000.00, '2026-03-03', N'Acc có siêu xe hiếm và Bape, thích hợp sưu tầm', 0, 0, 0, 1, 1, 'ACTIVE'),

(1350000.00, '2026-03-03', N'Acc có găng tay và Bape, đã mở nhiều vật phẩm', 0, 1, 0, 0, 1, 'ACTIVE');
INSERT INTO AnhAcc (ma_acc, duong_dan, thu_tu) VALUES
(1, N'/static/images/anhacc/1_1.png', 1),
(2, N'/static/images/anhacc/2_1.png', 1),
(2, N'/static/images/anhacc/2_2.png', 2),
(3, N'/static/images/anhacc/3_1.png', 1),
(4, N'/static/images/anhacc/4_1.png', 1),
(4, N'/static/images/anhacc/4_2.png', 2),
(5, N'/static/images/anhacc/5_1.png', 1),
(5, N'/static/images/anhacc/5_2.png', 2),
(6, N'/static/images/anhacc/6_1.png', 1),
(6, N'/static/images/anhacc/6_2.png', 2);

INSERT INTO NguoiMua (ten, email, tai_khoan, mat_khau, so_du, qr_nap_tien) VALUES
(N'Nguyễn Văn An', 'an.nguyen@gmail.com', 'nguyenvanan', '123456', 500000, 'qr_an.png'),
(N'Trần Thị Bình', 'binh.tran@gmail.com', 'tranthibinh', '123456', 250000, 'qr_binh.png'),
(N'Lê Hoàng Nam', 'nam.le@gmail.com', 'lehoangnam', '123456', 1200000, 'qr_nam.png'),
(N'Phạm Thu Trang', 'trang.pham@gmail.com', 'phamthutrang', '123456', 800000, 'qr_trang.png'),
(N'Đỗ Minh Quân', 'quan.do@gmail.com', 'dominhnquan', '123456', 300000, 'qr_quan.png'),
(N'Vũ Khánh Linh', 'linh.vu@gmail.com', 'vukhanhlinh', '123456', 950000, 'qr_linh.png'),
(N'Hoàng Gia Bảo', 'bao.hoang@gmail.com', 'hoanggiabao', '123456', 150000, 'qr_bao.png'),
(N'Ngô Đức Huy', 'huy.ngo@gmail.com', 'ngoduchuy', '123456', 600000, 'qr_huy.png');

INSERT INTO DonNapTien (ma_nguoi_mua, so_tien, trang_thai) VALUES
(1, 100000, 'SUCCESS'),
(2, 200000, 'SUCCESS'),
(3, 150000, 'SUCCESS'),
(4, 300000, 'SUCCESS'),
(5, 500000, 'SUCCESS'),
(6, 250000, 'SUCCESS'),
(7, 400000, 'SUCCESS'),
(8, 1000000, 'SUCCESS'),
(1, 350000, 'SUCCESS'),
(3, 700000, 'SUCCESS');