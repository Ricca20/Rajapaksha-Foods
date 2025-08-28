import Menu from "../infastructure/infastructure.menu.js";

export const createMenu = async (req, res) => {
  try {
    const { menuItems, priceFull, priceHalf, addOns } = req.body;

    const existingMenu = await Menu.findOne();
    // If no menu exists, create a new one
    if (!existingMenu) {
      const newMenu = new Menu({
        menuItems,
        priceFull,
        priceHalf,
        addOns
      });

      const savedMenu = await newMenu.save();
      return res.status(201).json({
        success: true,
        message: "Menu created successfully",
        data: savedMenu
      });
    } else {
      existingMenu.menuItems = menuItems;
      existingMenu.priceFull = priceFull;
      existingMenu.priceHalf = priceHalf;
      existingMenu.addOns = addOns;

      const updatedMenu = await existingMenu.save();
      return res.status(200).json({
        success: true,
        message: "Menu updated successfully",
        data: updatedMenu
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating/updating menu",
      error: error.message
    });
  }
};
//get

// Get menu
export const getMenu = async (req, res) => {
  try {
    const menu = await Menu.findOne();
    if (!menu) {
      return res.status(404).json({
        success: false,
        message: "Menu not found"
      });
    }
    res.status(200).json({
      success: true,
      data: menu
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching menu",
      error: error.message
    });
  }
};

// Set order window status
export const setOrderWindow = async (req, res) => {
  try {
    const { isEnabled, message } = req.body;

    const menu = await Menu.findOne();
    if (!menu) {
      return res.status(404).json({
        success: false,
        message: "Menu not found"
      });
    }

    menu.isOrderingEnabled = isEnabled;
    if (message) {
      menu.orderWindowMessage = message;
    }

    await menu.save();

    return res.status(200).json({
      success: true,
      message: isEnabled ? "Order window opened" : "Order window closed",
      data: menu
    });
  } catch (error) {
    console.error('Error in setOrderWindow:', error);
    return res.status(500).json({
      success: false,
      message: "Error updating order window status",
      error: error.message
    });
  }
};
