from flask import Blueprint, render_template
from extensions import db
from sqlalchemy import text
from extensions import socketio

doanhthu_bp = Blueprint("doanhthu_bp", __name__)
@doanhthu_bp.route("/doanhthu")
def thongke_doanhthu():
    #acc bán tháng này
    sql_ban_thang = """
        SELECT COUNT(*) 
        FROM DonMuaAcc
        WHERE MONTH(thoi_diem) = MONTH(GETDATE())
        AND YEAR(thoi_diem) = YEAR(GETDATE())
    """
    ban_thang = db.session.execute(text(sql_ban_thang)).scalar()

    #acc bán hôm nay
    sql_ban_homnay = """
        SELECT COUNT(*)
        FROM DonMuaAcc
        WHERE CAST(thoi_diem AS DATE) = CAST(GETDATE() AS DATE)
    """
    ban_homnay = db.session.execute(text(sql_ban_homnay)).scalar()

    #nạp tháng này
    sql_nap_thang = """
        SELECT ISNULL(SUM(so_tien),0)
        FROM DonNapTien
        WHERE trang_thai = 'SUCCESS'
        AND MONTH(thoi_diem) = MONTH(GETDATE())
        AND YEAR(thoi_diem) = YEAR(GETDATE())
    """
    nap_thang = db.session.execute(text(sql_nap_thang)).scalar()

    #nạp hôm nay
    sql_nap_homnay = """
        SELECT ISNULL(SUM(so_tien),0)
        FROM DonNapTien
        WHERE trang_thai = 'SUCCESS'
        AND CAST(thoi_diem AS DATE) = CAST(GETDATE() AS DATE)
    """
    nap_homnay = db.session.execute(text(sql_nap_homnay)).scalar()

    return render_template(
        "doanhthu.html",
        ban_thang=ban_thang,
        ban_homnay=ban_homnay,
        nap_thang=nap_thang,
        nap_homnay=nap_homnay
    )

#đã bán theo tuần -----------------------------------------------
@doanhthu_bp.route("/api/daban-theotuan")
def daban_theotuan():
    sql = """
    SELECT 
        DATEPART(WEEKDAY, thoi_diem) AS thu,
        COUNT(*) AS soluong
    FROM DonMuaAcc
    WHERE thoi_diem >= DATEADD(WEEK, DATEDIFF(WEEK,0,'2026-03-07'),0)
    AND thoi_diem < DATEADD(WEEK, DATEDIFF(WEEK,0,'2026-03-07')+1,0)
    GROUP BY DATEPART(WEEKDAY, thoi_diem)
    """
    result = db.session.execute(text(sql))
    data = [0]*7
    for r in result:
        thu = (r.thu + 5) % 7
        data[thu] = r.soluong
    return {"data": data}

def emit_update_dabantheotuan():
    sql = """
    SELECT 
        DATEPART(WEEKDAY, thoi_diem) AS thu,
        COUNT(*) AS soluong
    FROM DonMuaAcc
    WHERE thoi_diem >= DATEADD(WEEK, DATEDIFF(WEEK,0,'2026-03-07'),0)
    AND thoi_diem < DATEADD(WEEK, DATEDIFF(WEEK,0,'2026-03-07')+1,0)
    GROUP BY DATEPART(WEEKDAY, thoi_diem)
    """
    result = db.session.execute(text(sql))
    data = [0]*7
    for r in result:
        thu = (r.thu + 5) % 7
        data[thu] = r.soluong
    socketio.emit("update_dabantheotuan", {"data": data})

#doanh thu theo tuần -------------------------------------------------
@doanhthu_bp.route("/api/doanhthu-theotuan")
def doanhthu_theotuan():
    sql = """
    SELECT 
        DATEPART(WEEKDAY, thoi_diem) AS thu,
        SUM(so_tien) AS tongtien
    FROM DonNapTien
    WHERE thoi_diem >= DATEADD(WEEK, DATEDIFF(WEEK,0,'2026-03-07'),0)
    AND thoi_diem < DATEADD(WEEK, DATEDIFF(WEEK,0,'2026-03-07')+1,0)
    AND trang_thai = 'SUCCESS'
    GROUP BY DATEPART(WEEKDAY, thoi_diem)
    """
    result = db.session.execute(text(sql))
    data = [0]*7
    for r in result:
        thu = (r.thu + 5) % 7
        data[thu] = float(r.tongtien//1000000)
    print(data)
    return {"data": data}

def emit_update_doanhthutheotuan():
    sql = """
    SELECT 
        DATEPART(WEEKDAY, thoi_diem) AS thu,
        SUM(so_tien) AS tongtien
    FROM DonNapTien
    WHERE thoi_diem >= DATEADD(WEEK, DATEDIFF(WEEK,0,'2026-03-07'),0)
    AND thoi_diem < DATEADD(WEEK, DATEDIFF(WEEK,0,'2026-03-07')+1,0)
    AND trang_thai = 'SUCCESS'
    GROUP BY DATEPART(WEEKDAY, thoi_diem)
    """
    result = db.session.execute(text(sql))
    data = [0]*7
    for r in result:
        thu = (r.thu + 5) % 7
        data[thu] = float(r.tongtien//1000000)
    socketio.emit("update_doanhthutheotuan", {"data": data})

#doanh thu theo năm----------------------
@doanhthu_bp.route("/api/doanhthu-theonam")
def doanhthu_theonam():
    sql = """
    SELECT 
        MONTH(thoi_diem) AS thang,
        SUM(so_tien) AS tongtien
    FROM DonNapTien
    WHERE YEAR(thoi_diem) = YEAR(GETDATE())
    AND trang_thai = 'SUCCESS'
    GROUP BY MONTH(thoi_diem)
    """
    result = db.session.execute(text(sql))
    data = [0]*12
    for r in result:
        thang = r.thang - 1
        data[thang] = float(r.tongtien//1000000)
    return {"data": data}

def emit_update_doanhthutheonam():
    sql = """
    SELECT 
        MONTH(thoi_diem) AS thang,
        SUM(so_tien) AS tongtien
    FROM DonNapTien
    WHERE YEAR(thoi_diem) = YEAR(GETDATE())
    AND trang_thai = 'SUCCESS'
    GROUP BY MONTH(thoi_diem)
    """
    result = db.session.execute(text(sql))
    data = [0]*12
    for r in result:
        thang = r.thang - 1
        data[thang] = float(r.tongtien//1000000)
    socketio.emit("update_doanhthutheonam", {"data": data})