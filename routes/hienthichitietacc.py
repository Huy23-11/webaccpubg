from flask import Blueprint, render_template, session, jsonify
from sqlalchemy import text
from extensions import db

hienthichitietacc_bp = Blueprint("hienthichitietacc_bp",__name__)

@hienthichitietacc_bp.route("/chitietacc/<int:ma_acc>")
def hienthichitietacc(ma_acc):
  data = get_data(ma_acc)

  return render_template(
    "chitietacc.html",
    acc=data["acc"],
    dsanh=data["dsanh"],
    nguoimua=data["nguoimua"],
    vip=data["vip"]
  )

@hienthichitietacc_bp.route("/api/chitietacc/<int:ma_acc>", methods=["GET"])
def api_chitietacc(ma_acc):
  """
  API lấy chi tiết account
  ---
  tags:
    - Acc
  parameters:
    - name: ma_acc
      in: path
      type: integer
      required: true
      example: 5
  responses:
    200:
      description: Lấy chi tiết acc thành công
      schema:
        type: object
        properties:
          acc:
            type: object
          dsanh:
            type: array
            items:
              type: object
              properties:
                ma_anh:
                  type: integer
                duong_dan:
                  type: string
          nguoimua:
            type: object
  """

  data = get_data(ma_acc)
  return jsonify(data)

def get_data(ma_acc):
  
  sql_layacc = """
    SELECT a.*
    FROM Acc a
    WHERE ma_acc = :ma_acc
  """
  acc_row = db.session.execute(text(sql_layacc), {"ma_acc": ma_acc}).fetchone()

  acc = dict(acc_row._mapping) if acc_row else None

  sql_layanh = """
    SELECT aa.ma_anh, aa.duong_dan
    FROM AnhAcc aa
    WHERE aa.ma_acc = :ma_acc 
    ORDER BY aa.ma_anh
  """
  rows_anh = db.session.execute(text(sql_layanh), {"ma_acc": ma_acc}).fetchall()

  dsanh = []
  for row in rows_anh:
    dsanh.append({
      "ma_anh": row.ma_anh,
      "duong_dan": row.duong_dan
    })

  if "ma_nguoi_mua" not in session:
    nguoimua = {
      "ma_nguoi_mua": 0,
      "ten": "User",
      "so_du": 0
    }
  else:
    ma = session["ma_nguoi_mua"]
    sql = """
      SELECT nm.ma_nguoi_mua, nm.ten, nm.so_du
      FROM NguoiMua nm
      WHERE nm.ma_nguoi_mua = :ma
    """
    row = db.session.execute(text(sql), {"ma": ma}).fetchone()

    nguoimua = {
      "ma_nguoi_mua": row.ma_nguoi_mua,
      "ten": row.ten,
      "so_du": row.so_du
    } if row else None
  vip = 0
  if "ma_nguoi_mua" in session:
    ma_nguoi_mua = session["ma_nguoi_mua"]
    sqlvip = """
      SELECT vip
      FROM NguoiMua
      WHERE ma_nguoi_mua = :ma
    """
    vip = db.session.execute(text(sqlvip), {"ma": ma_nguoi_mua}).scalar()
  return {
    "acc": acc,
    "dsanh": dsanh,
    "nguoimua": nguoimua,
    "vip": vip
  }