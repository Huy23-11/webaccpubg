from flask import render_template, Blueprint, jsonify
from extensions import db
from sqlalchemy import text
from datetime import datetime

hienthitrangchu_bp = Blueprint("hienthitrangchu_bp",__name__)

@hienthitrangchu_bp.route("/")
def trangchu():
  data = get_data()

  return render_template(
    "trangchu.html",
    topnap=data["topnap"],
    thang=data["thang"],
    dsacc=data["dsacc"]
  )

@hienthitrangchu_bp.route("/api/trangchu", methods=["GET"])
def api_trangchu():
  """
  API trang chủ
  ---
  tags:
    - Trang chủ
  responses:
    200:
      description: Lấy dữ liệu trang chủ thành công
      schema:
        type: object
        properties:
          dsacc:
            type: array
            items:
              type: object
              properties:
                ma_acc:
                  type: integer
                gia:
                  type: number
                duong_dan:
                  type: string
          topnap:
            type: array
            items:
              type: object
              properties:
                ten:
                  type: string
                tong_nap:
                  type: number
          thang:
            type: integer
  """

  data = get_data()
  return jsonify(data)

def get_data():
  sql = """
    SELECT 
      a.*,
      anh.duong_dan
    FROM Acc a
    LEFT JOIN AnhAcc anh
      ON a.ma_acc = anh.ma_acc
      AND anh.thu_tu = 1
    WHERE a.trang_thai = 'ACTIVE'
  """
  rows_acc = db.session.execute(text(sql)).fetchall()

  dsacc = []
  for row in rows_acc:
    dsacc.append({
      "ma_acc": row.ma_acc,
      "gia": row.gia,
      "ngay_dang": row.ngay_dang,
      "mo_ta": row.mo_ta if hasattr(row, "mo_ta") else None,
      "so_luot_xem": row.so_luot_xem if hasattr(row, "so_luot_xem") else None,
      "duong_dan": row.duong_dan
    })

  sql = """
    SELECT TOP 5
      nm.ten,
      SUM(dn.so_tien) AS tong_nap
    FROM DonNapTien dn
    JOIN NguoiMua nm ON dn.ma_nguoi_mua = nm.ma_nguoi_mua
    WHERE 
      dn.trang_thai = 'SUCCESS'
      AND MONTH(dn.thoi_diem) = MONTH(GETDATE())
      AND YEAR(dn.thoi_diem) = YEAR(GETDATE())
    GROUP BY nm.ten
    ORDER BY tong_nap DESC
  """
  rows_topnap = db.session.execute(text(sql)).fetchall()

  topnap = []
  for row in rows_topnap:
    topnap.append({
      "ten": row.ten,
      "tong_nap": row.tong_nap
    })

  thang = datetime.now().month

  return {
    "dsacc": dsacc,
    "topnap": topnap,
    "thang": thang
  }