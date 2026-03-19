from flask import Blueprint, render_template, session, redirect, jsonify
from extensions import db
from sqlalchemy import text

quanlyacc = Blueprint("quanlyacc", __name__)

@quanlyacc.route("/quanlyacc")
def dsacc_quanlyacc():
  if "role" not in session or session["role"] != "admin":
    return redirect("/dangnhap")

  data = get_data()

  return render_template(
    "quanlyacc.html",
    dsacc=data["dsacc"],
    tuyetpham=data["tuyetpham"],
    xemnhieu=data["xemnhieu"],
    giacao=data["giacao"],
    tren10tr=data["tren10tr"]
  )

@quanlyacc.route("/api/quanlyacc", methods=["GET"])
def api_dsacc_quanlyacc():
  """
  API lấy danh sách account và thống kê
  ---
  tags:
    - Admin - Quản lý Acc
  responses:
    200:
      description: Thành công
      schema:
        type: object
        properties:
          dsacc:
            type: array
          tuyetpham:
            type: integer
          xemnhieu:
            type: object
          giacao:
            type: object
          tren10tr:
            type: integer
  """

  data = get_data()
  return jsonify(data)

def get_data():
  sql = """
    SELECT ma_acc, gia, ngay_dang, mo_ta, so_luot_xem,
           gang_tay, mu_dinh, sieu_xe, bape, trang_thai
    FROM Acc
    ORDER BY ma_acc ASC
  """
  result = db.session.execute(text(sql))

  danh_sach_acc = []
  for row in result:
    danh_sach_acc.append({
      "ma_acc": row.ma_acc,
      "gia": row.gia,
      "ngay_dang": str(row.ngay_dang),
      "mo_ta": row.mo_ta,
      "so_luot_xem": row.so_luot_xem,
      "gang_tay": row.gang_tay,
      "mu_dinh": row.mu_dinh,
      "sieu_xe": row.sieu_xe,
      "bape": row.bape,
      "trang_thai": row.trang_thai
    })

  sql_tuyetpham = """
    SELECT COUNT(*) AS soluong
    FROM Acc
    WHERE gang_tay = 1
       OR mu_dinh = 1
       OR sieu_xe = 1
       OR bape = 1
  """
  tuyetpham = db.session.execute(text(sql_tuyetpham)).scalar()

  sql_xemnhieu = """
    SELECT TOP 1 ma_acc, so_luot_xem
    FROM Acc
    ORDER BY so_luot_xem DESC
  """
  row_xemnhieu = db.session.execute(text(sql_xemnhieu)).fetchone()

  xemnhieu = None
  if row_xemnhieu:
    xemnhieu = {
      "ma_acc": row_xemnhieu.ma_acc,
      "so_luot_xem": row_xemnhieu.so_luot_xem
    }

  sql_giacao = """
    SELECT TOP 1 ma_acc, gia
    FROM Acc
    ORDER BY gia DESC
  """
  row_giacao = db.session.execute(text(sql_giacao)).fetchone()

  giacao = None
  if row_giacao:
    giacao = {
      "ma_acc": row_giacao.ma_acc,
      "gia": row_giacao.gia
    }

  sql_tren10tr = """
    SELECT COUNT(*)
    FROM Acc
    WHERE gia >= 10000000
  """
  tren10tr = db.session.execute(text(sql_tren10tr)).scalar()

  return {
    "dsacc": danh_sach_acc,
    "tuyetpham": tuyetpham,
    "xemnhieu": xemnhieu,
    "giacao": giacao,
    "tren10tr": tren10tr
  }