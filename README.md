# Rocket Delivery Mobile - MOD 14
** Ric Nybo **

# BACKGROUND RESEARCH

### The difference between Native and Cross-Platform mobile application.

The difference between native and cross-platform mobile applications is mainly in the way they are developed and how they run on different platforms. Here is a brief summary of the main differences:

* Native apps are built with a platform-specific programming language and tools, such as Java or Kotlin for Android, and Objective-C or Swift for iOS. They can access all the features and functions of the device and provide the best performance and user experience. However, they require more time and resources to develop and maintain, and they need separate codebases for each platform.

* Cross-platform apps are built with a web-based language such as CSS, HTML, or JavaScript, and use a framework or a tool that allows them to run natively on multiple platforms, such as Flutter, React Native, or Xamarin. They can reuse most of the code for different platforms and reduce the development time and cost. However, they may have lower performance and inconsistent user interfaces across platforms, and they may not be able to access all the device features and functions.

### The difference between React Native and React.

React and React Native are both technologies developed by Facebook to create user interfaces using JavaScript, but they have different purposes and features. Here is a summary of the main differences:

* React is a web UI library that allows you to build responsive and interactive user interfaces for web applications using reusable components. It uses a Virtual DOM to optimize performance and update the UI efficiently. It is widely used in web development and has a huge community of developers and tools.

* React Native is a cross-platform mobile development framework that allows you to build native mobile applications for Android, iOS, Windows, and other platforms using native UI components and APIs. It uses a bridge to render the app components on different platforms. It can reuse most of the code for different platforms and reduce the development time and cost.

### Download the wireframe template and briefly go over the functionalities of the mobile app. Roughly plan for which APIs should be utilized for the required app functionalities.

* Authentication Page - The Authentication Page or screen takes the user input of an email address and a password followed by pressing the LOG IN button.  The API call expected is the POST /api/login with body params of email and password.

* Restaurants Page - The Restaurants page by default will display all restaurants from the DB.  The list can be filtered by rating, price range, or both.  The API call will be the GET /api/restaurants?rating=*&price_range=*. Replace * with a number 1-5 or 1-3 respectively to receive a list of restaurants that a filtered or omit the filter to have unfiltered lists.  When the user presses a restaurant card, they will be presented with the Restaurant Menu for the pressed restaurant.

* Restaurant Menu / Order Page - This page displays the menu items for a restaurant.  It allows the user to pick a desired quantity for each menu item.  A Create Order button will become available when at least 1 menu item has at least a quantity of 1 selected. When the user presses the Create Order button, a Order Confirmation modal opens displaying an order summary including a total and a CONFIRM ORDER button.  When the user presses the CONFIRM ORDER button, the button label changes to PROCESSING ORDER... Once processing completes, A success message replaces the button, or a failure message is displayed below the button. The user can close the modal by pressing the X in the upper right of the modal.  Two API calls will be required.  First an API call is needed to get the menu items for the restaurant.  GET /api/products?restaurant=7 where a query parameter is used to identify the restaurant by its ID number.  Second, an API call to create the order is required.  POST /api/orders where the body includes a JSON object with the required information on the restaurant, the customer, and the products purchased.

* Order history Page - The Oder History page displays a list of orders made by the customer.  Pressing the VIEW zoom-plus icon will open a modal displaying the details of the order selected.  An API call getting the list of oders placed by the customer will be made.  GET /api/orders?id=1&type=customer where id is the customer ID.  Customer is required as this API can get lists of orders based on other criteria which is not needed for this page.  The details of the customer's orders are returned in JSON format.
