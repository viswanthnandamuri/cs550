const express = require("express");
const db = require("./db/connection");
const cors = require("cors");

const app = express();

const PORT = 3002;
app.use(cors());
app.use(express.json());

//items
app.get("/api/get/items", (req, res) => {
  db.query("SELECT * FROM items;", (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result);
  });
});

//busEntities
app.get("/api/get/busEntities", (req, res) => {
  db.query("SELECT * FROM busEntities;", (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result);
  });
});

//billOfMaterials
app.get("/api/get/billOfMaterials", (req, res) => {
  db.query("SELECT * FROM billOfMaterials;", (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result);
  });
});

// supplierDiscounts
app.get("/api/get/supplierDiscounts", (req, res) => {
  db.query("SELECT * FROM supplierDiscounts;", (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result);
  });
});

//supplyUnitPricing
app.get("/api/get/supplyUnitPricing", (req, res) => {
  db.query("SELECT * FROM supplyUnitPricing;", (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result);
  });
});

//manufDiscounts
app.get("/api/get/manufDiscounts", (req, res) => {
  db.query("SELECT * FROM manufDiscounts;", (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result);
  });
});

//manufUnitPricing

app.get("/api/get/manufUnitPricing", (req, res) => {
  db.query("SELECT * FROM manufUnitPricing;", (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result);
  });
});

//shippingPricing

app.get("/api/get/shippingPricing", (req, res) => {
  db.query("SELECT * FROM shippingPricing;", (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result);
  });
});

//customerDemand

app.get("/api/get/customerDemand", (req, res) => {
  db.query("SELECT * FROM customerDemand;", (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result);
  });
});

//supplyOrders
app.get("/api/get/supplyOrders", (req, res) => {
  db.query("SELECT * FROM supplyOrders;", (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result);
  });
});

//manufOrders

app.get("/api/get/manufOrders", (req, res) => {
  db.query("SELECT * FROM manufOrders;", (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result);
  });
});

//shipOrders

app.get("/api/get/shipOrders", (req, res) => {
  db.query("SELECT * FROM shipOrders;", (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result);
  });
});

app.get("/api/get/query1", (req, res) => {
  db.query(
    "SELECT cd.customer, cd.item, cd.qty AS demandQty, ifnull(SUM(shipo.qty), 0) AS suppliedQty FROM customerDemand cd LEFT JOIN shipOrders shipo ON cd.item = shipo.item AND cd.customer = shipo.recipient GROUP BY cd.customer, cd.item, cd.qty ORDER BY cd.customer, cd.item;",
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.send(result);
    }
  );
});

app.get("/api/get/query2", (req, res) => {
  db.query(
    "select mo.item as item, sum(mo.qty) as totalManufQty from manufOrders mo group by mo.item order by mo.item;",
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.send(result);
    }
  );
});

app.get("/api/get/query3", (req, res) => {
  db.query(
    "SELECT Req.manuf, req.matItem, req.requiredQty, ifnull(sum(so.qty),0) AS shippedQty FROM(SELECT mo.manuf AS manuf , bom.matItem AS matItem, sum( mo.qty * bom.QtyMatPerItem) AS requiredQty FROM manufOrders mo,billOfMaterials bom WHERE mo.item = bom.prodItem GROUP By mo.manuf, bom.matItem) Req LEFT OUTER JOIN shipOrders so ON Req.manuf = so.recipient AND Req.matItem = so.item GROUP By Req.manuf, req.matItem,req.requiredQty ORDER BY Req.manuf, req.matItem;",
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.send(result);
    }
  );
});

app.get("/api/get/query4", (req, res) => {
  db.query(
    "SELECT mo.item AS item, mo.manuf AS manuf, COALESCE(shippedOutQty, 0) AS shippedOutQty, mo.qty AS orderedQty FROM manufOrders mo LEFT JOIN ( SELECT sender, item, SUM(qty) AS shippedOutQty FROM shipOrders GROUP BY sender, item ) so ON mo.manuf = so.sender AND mo.item = so.item ORDER BY mo.item, mo.manuf;",
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.send(result);
    }
  );
});

app.get("/api/get/query5", (req, res) => {
  db.query(
    "select supo.item as item, supo.supplier as supplier, supo.qty as suppliedQty, ifnull(sum(distinct shipo.qty),0) as shippedQty from supplyOrders supo left outer join shipOrders shipo on supo.item = shipo.item and supo.supplier = shipo.sender group by supo.item, supo.supplier, supo.qty order by supo.item, supo.supplier ;",
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.send(result);
    }
  );
});

app.get("/api/get/query6", (req, res) => {
  db.query(
    "select supd.supplier, ifnull((case when calc.totalcost<supd.amt1 then calc.totalcost when calc.totalcost>supd.amt2 then ((supd.amt1+(supd.amt2-supd.amt1)*(1-supd.disc1))+(calc.totalcost - supd.amt2)*(1-supd.disc2)) when calc.totalcost>supd.amt1 and calc.totalcost<supd.amt2 then (supd.amt1+(calc.totalcost - supd.amt1)*(1-supd.disc1)) end),0) as cost from (select supo.supplier as supplier, sum(supo.qty*supup.ppu) as totalcost from supplyOrders supo, supplyUnitPricing supup where supo.item = supup.item and supo.supplier = supup.supplier group by supo.supplier) calc right outer join supplierDiscounts supd on calc.supplier = supd.supplier order by supd.supplier ;",
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.send(result);
    }
  );
});

app.get("/api/get/query7", (req, res) => {
  db.query(
    "select mfd.manuf,ifnull((case when manuCOst.totalcost < mfd.amt1 then manuCOst.totalcost else ((1-mfd.disc1)*(manuCOst.totalcost - mfd.amt1)+mfd.amt1) end),0) as cost from (select mnfo.manuf as manuf, sum(mnfup.setUpCost+(mnfo.qty*mnfup.prodCostPerUnit)) as totalcost from manufOrders mnfo, manufUnitPricing mnfup where mnfo.item = mnfup.prodItem and mnfo.manuf = mnfup.manuf group by mnfo.manuf) manuCOst right outer join manufDiscounts mfd on manuCOst.manuf = mfd.manuf order by mfd.manuf;",
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.send(result);
    }
  );
});

app.get("/api/get/query8", (req, res) => {
  db.query(
    "SELECT sp.shipper, ifnull(SUM(GREATEST((CASE WHEN calc.basecost < sp.amt1 THEN calc.basecost WHEN calc.basecost > sp.amt2 THEN ((sp.amt1 + (sp.amt2 - sp.amt1) * (1 - sp.disc1)) + (calc.basecost - sp.amt2) * (1 - sp.disc2)) WHEN calc.basecost > sp.amt1 AND calc.basecost < sp.amt2 THEN (sp.amt1 + (calc.basecost - sp.amt1) * (1 - sp.disc1)) END), sp.minPackagePrice)),0) AS cost FROM ( SELECT ship_ord.shipper, BE1.shipLoc AS fromloc, BE2.shipLoc AS toloc , SUM(DISTINCT ship_ord.qty * itm.unitWeight * ship_prc.pricePerLb) AS basecost FROM shipOrders ship_ord, busEntities BE1, busEntities BE2, items itm, shippingPricing ship_prc WHERE ship_ord.sender = BE1.entity AND ship_ord.recipient = BE2.entity AND ship_ord.item = itm.item AND ship_ord.shipper = ship_prc.shipper AND BE1.shipLoc = ship_prc.fromloc AND BE2.shipLoc = ship_prc.toloc GROUP BY ship_ord.shipper, BE1.shipLoc, BE2.shipLoc ) calc RIGHT OUTER JOIN shippingPricing sp ON calc.shipper = sp.shipper AND calc.fromloc = sp.fromloc AND calc.toloc = sp.toloc GROUP BY sp.shipper ORDER BY sp.shipper;",
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.send(result);
    }
  );
});

app.get("/api/get/query9", (req, res) => {
  db.query(
    "SELECT (SELECT ifnull(SUM(cost), 0) FROM perSupplierCost) AS supplyCost, (SELECT ifnull(SUM(cost), 0) FROM perManufCost) AS manufCost, (SELECT ifnull(SUM(cost), 0) FROM perShipperCost) AS shippingCost, (SELECT ifnull(SUM(cost), 0) FROM perSupplierCost) + (SELECT ifnull(SUM(cost), 0) FROM perManufCost) + (SELECT ifnull(SUM(cost), 0) FROM perShipperCost) AS totalCost;",
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.send(result);
    }
  );
});

app.get("/api/get/query10", (req, res) => {
  db.query(
    "SELECT DISTINCT customer FROM ( SELECT customer, item, SUM(qty) AS total_demand FROM customerDemand GROUP BY customer, item ) cd LEFT OUTER JOIN ( SELECT recipient, item, SUM(qty) AS total_shipped FROM shipOrders GROUP BY recipient, item ) so ON cd.customer = so.recipient AND cd.item = so.item WHERE cd.total_demand > COALESCE(so.total_shipped, 0) ORDER BY customer;",
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.send(result);
    }
  );
});

app.get("/api/get/query11", (req, res) => {
  db.query(
    "SELECT DISTINCT sup_o.supplier AS supplier FROM supplyOrders sup_o WHERE sup_o.qty > ( SELECT COALESCE(SUM(ship_o.qty), 0) FROM shipOrders ship_o WHERE ship_o.sender = sup_o.supplier AND ship_o.item = sup_o.item ) ORDER BY sup_o.supplier;",
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.send(result);
    }
  );
});

app.get("/api/get/query12", (req, res) => {
  db.query(
    "SELECT DISTINCT mo.manuf FROM manufOrders mo JOIN billOfMaterials bom ON mo.item = bom.prodItem LEFT JOIN ( SELECT so.recipient, bm.matitem, SUM(so.qty) AS received FROM shipOrders so JOIN billOfMaterials bm ON so.item = bm.matitem GROUP BY so.recipient, bm.matitem ) rec ON mo.manuf = rec.recipient AND bom.matitem = rec.matitem WHERE rec.received IS NULL OR bom.qtyMatPerItem * mo.qty > rec.received ORDER BY mo.manuf;",
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.send(result);
    }
  );
});

app.get("/api/get/query13", (req, res) => {
  db.query(
    "SELECT DISTINCT mnf.manuf FROM manufOrders mnf WHERE mnf.qty > ( SELECT ifnull(SUM(ship_o.qty), 0) FROM shipOrders ship_o WHERE ship_o.sender = mnf.manuf AND ship_o.item = mnf.item ) ORDER BY mnf.manuf;",
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.send(result);
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
