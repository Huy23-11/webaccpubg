from flask import Blueprint, render_template, session, redirect, jsonify
from sqlalchemy import text
from extensions import db

dsnguoimua_bp = Blueprint("dsnguoimua_bp",__name__)

@dsnguoimua_bp.route("/quanlynguoimua")
def dsnguoimua():
  if "role" not in session or session["role"] != "admin":
    return redirect("/dangnhap")

  data = get_data()

  return render_template(
    "quanlynguoimua.html",
    dsnguoi = data["dsnguoi"],
    muathang = data["muathang"],
    napthang = data["napthang"],
    muanhieu = data["muanhieu"],
    napnhieu = data["napnhieu"]
  )

@dsnguoimua_bp.route("/api/quanlynguoimua", methods=["GET"])
def api_dsnguoimua():
  """
  API quản lý người mua
  ---
  tags:
    - Admin - Người mua
  responses:
    200:
      description: Lấy dữ liệu thành công
      schema:
        type: object
        properties:
          dsnguoi:
            type: array
          muathang:
            type: object
          napthang:
            type: object
          muanhieu:
            type: object
          napnhieu:
            type: object
  """

  data = get_data()
  return jsonify(data)

def get_data():
  sql = """
    SELECT 
      nm.ma_nguoi_mua,
      nm.ten,
      nm.email,
      nm.so_du,

      (SELECT COUNT(*)
       FROM DonMuaAcc dm
       WHERE dm.ma_nguoi_mua = nm.ma_nguoi_mua
       AND MONTH(dm.thoi_diem) = MONTH(GETDATE())
       AND YEAR(dm.thoi_diem) = YEAR(GETDATE())
      ) AS mua_thang,

      (SELECT ISNULL(SUM(dn.so_tien),0)
       FROM DonNapTien dn
       WHERE dn.ma_nguoi_mua = nm.ma_nguoi_mua
       AND dn.trang_thai = 'SUCCESS'
       AND MONTH(dn.thoi_diem) = MONTH(GETDATE())
       AND YEAR(dn.thoi_diem) = YEAR(GETDATE())
      ) AS nap_thang,

      (SELECT COUNT(*)
       FROM DonMuaAcc dm
       WHERE dm.ma_nguoi_mua = nm.ma_nguoi_mua
      ) AS mua_tong,

      (SELECT ISNULL(SUM(dn.so_tien),0)
       FROM DonNapTien dn
       WHERE dn.ma_nguoi_mua = nm.ma_nguoi_mua
       AND dn.trang_thai = 'SUCCESS'
      ) AS nap_tong

    FROM NguoiMua nm
    ORDER BY nm.ma_nguoi_mua DESC
  """

  rows = db.session.execute(text(sql)).fetchall()

  dsnguoi = []
  for row in rows:
    dsnguoi.append({
      "ma_nguoi_mua": row.ma_nguoi_mua,
      "ten": row.ten,
      "email": row.email,
      "so_du": row.so_du,
      "mua_thang": row.mua_thang,
      "nap_thang": row.nap_thang,
      "mua_tong": row.mua_tong,
      "nap_tong": row.nap_tong
    })

  sql_muathang = """
    SELECT TOP 1 N.ten, COUNT(*) AS soluong
    FROM DonMuaAcc D
    JOIN NguoiMua N ON N.ma_nguoi_mua = D.ma_nguoi_mua
    WHERE MONTH(D.thoi_diem) = MONTH(GETDATE())
    AND YEAR(D.thoi_diem) = YEAR(GETDATE())
    GROUP BY N.ten
    ORDER BY soluong DESC
  """
  row = db.session.execute(text(sql_muathang)).fetchone()
  muathang = {"ten": row.ten, "soluong": row.soluong} if row else None

  sql_napthang = """
    SELECT TOP 1 N.ten, SUM(D.so_tien) AS tongtien
    FROM DonNapTien D
    JOIN NguoiMua N ON N.ma_nguoi_mua = D.ma_nguoi_mua
    WHERE D.trang_thai = 'SUCCESS'
    AND MONTH(D.thoi_diem) = MONTH(GETDATE())
    AND YEAR(D.thoi_diem) = YEAR(GETDATE())
    GROUP BY N.ten
    ORDER BY tongtien DESC
  """
  row = db.session.execute(text(sql_napthang)).fetchone()
  napthang = {"ten": row.ten, "tongtien": row.tongtien} if row else None

  sql_muanhieu = """
    SELECT TOP 1 N.ten, COUNT(*) AS soluong
    FROM DonMuaAcc D
    JOIN NguoiMua N ON N.ma_nguoi_mua = D.ma_nguoi_mua
    GROUP BY N.ten
    ORDER BY soluong DESC
  """
  row = db.session.execute(text(sql_muanhieu)).fetchone()
  muanhieu = {"ten": row.ten, "soluong": row.soluong} if row else None

  sql_napnhieu = """
    SELECT TOP 1 N.ten, SUM(D.so_tien) AS tongtien
    FROM DonNapTien D
    JOIN NguoiMua N ON N.ma_nguoi_mua = D.ma_nguoi_mua
    WHERE D.trang_thai = 'SUCCESS'
    GROUP BY N.ten
    ORDER BY tongtien DESC
  """
  row = db.session.execute(text(sql_napnhieu)).fetchone()
  napnhieu = {"ten": row.ten, "tongtien": row.tongtien} if row else None

  return {
    "dsnguoi": dsnguoi,
    "muathang": muathang,
    "napthang": napthang,
    "muanhieu": muanhieu,
    "napnhieu": napnhieu
  }